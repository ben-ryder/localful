import {LocalStore} from "./storage/local-store";
import * as A from "@automerge/automerge";
import {EncryptionHelper} from "./encryption/encryption-helper";
import {
  ChangeDto, ChangesSocketEvents,
  CreateUserRequest, CreateUserResponse,
  ErrorIdentifiers,
  InfoDto,
  LoginResponse,
  NoKeysUserDto, RefreshResponse
} from "@ben-ryder/lfb-common";
import {v4 as createUUID} from "uuid";
import {
  NoAccessTokenError,
  NoEncryptionKeyError,
  NoRefreshTokenError, NoServerError,
  RequestError
} from "./errors/errors";
import axios from "axios";
import {io, Socket} from "socket.io-client";

export type UpdateListener<DocType> = (doc: A.Doc<DocType>) => void;

export interface QueryOptions {
  url: string,
  method: 'GET'|'POST'|'PATCH'|'DELETE',
  data?: object,
  params?: object,
  noAuthRequired?: boolean,
  requiresEncryptionKey?: boolean
}


export class LFBApplication<DocType> {
  private document: A.Doc<DocType>;
  private readonly initialDocument: A.Doc<DocType>
  private readonly updateListeners: UpdateListener<DocType>[];

  private isOnline: boolean;
  private serverUrl: string | null;
  private socket: Socket | null;
  private browserChannel: BroadcastChannel;

  private encryptionKey?: string;
  private accessToken?: string;
  private refreshToken?: string;

  private readonly localStore: LocalStore;

  constructor(initialDocument: DocType) {
    this.initialDocument = initialDocument;
    this.document = A.clone(initialDocument);
    this.updateListeners = [];

    this.isOnline = navigator.onLine;
    this.browserChannel = new BroadcastChannel("changes");
    this.serverUrl = null;
    this.socket = null;

    this.localStore = new LocalStore();

    this.browserChannel.onmessage = (event: MessageEvent<{type: "changes", changes: ChangeDto[]}>) => {
      if (event.data.type === "changes") {
        this.handleExternalChanges(event.data.changes);
      }
    };

    window.addEventListener("online", () => {
      this.isOnline = true;
    });
    window.addEventListener("offline", () => {
      this.isOnline = false;
    });
  }

  /**
   * Initialize the application.
   * This includes loading the currently saved document.
   */
  async init() {
    const doc = await this.loadDocument();
    this.updateDocument(doc);
  }

  /**
   * Completely delete all stored data and remove the server.
   */
  async nuke() {
    await this.localStore.clear();
    await this.removeServer();
  }

  /**
   * Set up the server connection.
   *
   * @param serverUrl
   */
  async setupServer(serverUrl: string) {
    this.serverUrl = serverUrl;
    this.socket = io(this.serverUrl);

    this.socket.on(ChangesSocketEvents.changes, (changes: ChangeDto[]) => {
      this.handleExternalChanges(changes);
    });

    this.syncWithServer();
  }

  /**
   * Remove the server connection.
   */
  async removeServer() {
    this.serverUrl = null;

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Check if the application is connected to a server.
   */
  hasServer() {
    return this.serverUrl !== null;
  }

  /**
   * Set if the application has an internet connection.
   *
   * @param isOnline
   */
  setIsOnline(isOnline: boolean) {
    this.isOnline = isOnline;

    if (isOnline) {
      this.syncWithServer();
    }
  }

  /**
   * Add a listener to call when the application document updates.
   *
   * @param updateListener
   */
  addUpdateListener(updateListener: UpdateListener<DocType>) {
    this.updateListeners.push(updateListener);
  }

  /**
   * Update the application document and call the listeners.
   *
   * @param updatedDocument
   */
  private updateDocument(updatedDocument: A.Doc<DocType>) {
    this.document = updatedDocument;

    for (const listener of this.updateListeners) {
      listener(this.document);
    }
  }

  /**
   * Load the saved document.
   */
  private async loadDocument() {
    const encryptionKey = await this.localStore.loadEncryptionKey();
    if (!encryptionKey) {
      throw new NoEncryptionKeyError();
    }

    const encryptedChanges = await this.localStore.loadAllChanges();
    const changes = encryptedChanges.map(encryptedChange => {
      const change = EncryptionHelper.decryptText(encryptionKey, encryptedChange.data).replaceAll("\"", "");
      return new Uint8Array([...atob(change)].map(char => char.charCodeAt(0))) as A.Change;
    });
    const [newDocument] = A.applyChanges<DocType>(A.clone(this.initialDocument), changes);

    return newDocument;
  }

  /**
   * Handle changes coming from outside the application (from the server or another browser context).
   *
   * @param changes
   * @private
   */
  private async handleExternalChanges(changes: ChangeDto[]) {
    const changeIds = await this.localStore.loadAllChangeIds();
    for (const change of changes) {
      if (!changeIds.includes(change.id)) {
        await this.localStore.saveChange(change);
      }
    }

    const document = await this.loadDocument();
    this.updateDocument(document);
  }

  /**
   * Emit changes from the application to the server and/or another browser context.
   *
   * @param changes
   * @private
   */
  private emitChanges(changes: ChangeDto[]) {
    if (this.socket && this.isOnline) {
      this.socket.emit(ChangesSocketEvents.changes, changes);
    }
    else {
      this.browserChannel.postMessage({type: ChangesSocketEvents.changes, changes: changes});
    }
  }

  /**
   * Sync changes between the application and the server.
   */
  private async syncWithServer() {
    const localIds = await this.localStore.loadAllChangeIds();
    const serverIds = await this.getChangeIds();

    const newIdsOnServer = serverIds.filter(id => !localIds.includes(id));
    const newIdsOnClient = localIds.filter(id => !serverIds.includes(id));

    if (newIdsOnClient.length > 0) {
      const changesForServer = await this.localStore.loadChanges(newIdsOnClient);
      this.emitChanges(changesForServer);
    }

    if (newIdsOnServer.length > 0) {
      const changesFromServer = await this.getChanges(newIdsOnServer);

      const changeIds = await this.localStore.loadAllChangeIds();
      for (const change of changesFromServer) {
        if (!changeIds.includes(change.id)) {
          await this.localStore.saveChange(change);
        }
      }
    }

    const doc = await this.loadDocument();
    this.updateDocument(doc);
  }

  /**
   * Make a change to the application document.
   *
   * @param changeFunc
   */
  async makeChange(changeFunc: A.ChangeFn<DocType>) {
    const encryptionKey = await this.localStore.loadEncryptionKey();
    if (!encryptionKey) {
      throw new NoEncryptionKeyError();
    }

    const updatedDocument = A.change(this.document, changeFunc);
    const rawChange = A.getLastLocalChange(updatedDocument);

    // @ts-ignore - todo: fix this being required
    const encodedChange = btoa(String.fromCharCode(...rawChange));
    const encryptedChange = EncryptionHelper.encryptData(encryptionKey, encodedChange);

    const change: ChangeDto = {
      id: createUUID(),
      data: encryptedChange
    };

    await this.localStore.saveChange(change);

    this.updateDocument(updatedDocument);
    this.emitChanges([change]);
  }

  private async query<ResponseType>(options: QueryOptions, repeat = false): Promise<ResponseType> {
    if (!this.serverUrl) {
      throw new NoServerError();
    }

    if (!options.noAuthRequired && !this.accessToken) {
      const accessToken = await this.localStore.loadAccessToken();
      const refreshToken = await this.localStore.loadRefreshToken();
      if (refreshToken) {
        this.refreshToken = refreshToken;
      }
      else {
        throw new NoRefreshTokenError();
      }

      if (accessToken) {
        this.accessToken = accessToken;
      }
      else if (!repeat) {
        return this.refreshAuthAndRetry(options);
      }
      else {
        throw new NoAccessTokenError();
      }
    }


    let response: any = null;
    try {
      response = await axios({
        ...options,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
    }
    catch (e: any) {
      if (e.response?.data?.identifier === ErrorIdentifiers.ACCESS_UNAUTHORIZED && !repeat) {
        return this.refreshAuthAndRetry<ResponseType>(options);
      }

      throw new RequestError(
          {
            message: `There was an error with the request '${options.url} [${options.method}]'`,
            originalError: e,
            response: e.response?.data
          }
      );
    }

    return response.data;
  }

  private async refreshAuthAndRetry<ResponseType>(options: QueryOptions): Promise<ResponseType> {
    await this.refresh();
    return this.query(options, true);
  }

  private async checkEncryptionKey() {
    if (!this.encryptionKey) {
      const encryptionKey = await this.localStore.loadEncryptionKey();

      if (encryptionKey) {
        this.encryptionKey = encryptionKey;
        return;
      }

      throw new NoEncryptionKeyError();
    }
  }

  // Info
  async getInfo() {
    return this.query<InfoDto>({
      method: 'GET',
      url: `${this.serverUrl}/v1/info`,
      noAuthRequired: true
    });
  }

  // User
  public async login(username: string, password: string) {
    // Convert plain text password into serverPassword and masterKey
    const accountKeys = EncryptionHelper.getAccountKeys(username, password);

    const data = await this.query<LoginResponse>({
      method: 'POST',
      url: `${this.serverUrl}/v1/auth/login`,
      data: {
        username,
        password: accountKeys.serverPassword
      },
      noAuthRequired: true
    });

    // Decrypt users encryptionKey with their masterKey
    // todo: don't trust data is encrypted correctly
    const encryptionKey = EncryptionHelper.decryptText(accountKeys.masterKey, data.user.encryptionSecret);
    await this.localStore.saveEncryptionKey(encryptionKey);

    // Save user details and tokens
    await this.localStore.saveCurrentUser(data.user);

    await this.localStore.saveRefreshToken(data.refreshToken);
    this.refreshToken = data.refreshToken;

    await this.localStore.saveAccessToken(data.accessToken);
    this.accessToken = data.accessToken;

    return data;
  }

  public async register(noKeysUser: NoKeysUserDto) {
    // Get user account keys from plain text password and overwrite the user password.
    const accountKeys = EncryptionHelper.getAccountKeys(noKeysUser.username, noKeysUser.password);

    // Generate the user's encryptionSecret
    const encryptionKey = EncryptionHelper.generateEncryptionKey();
    const encryptionSecret = EncryptionHelper.encryptText(accountKeys.masterKey, encryptionKey);

    const user: CreateUserRequest = {
      username: noKeysUser.username,
      email: noKeysUser.email,
      password: accountKeys.serverPassword,
      encryptionSecret
    }

    const data = await this.query<CreateUserResponse>({
      method: 'POST',
      url: `${this.serverUrl}/v1/users`,
      data: user,
      noAuthRequired: true
    });

    await this.localStore.saveEncryptionKey(encryptionKey);
    await this.localStore.saveCurrentUser(data.user);

    await this.localStore.saveRefreshToken(data.refreshToken);
    this.refreshToken = data.refreshToken;
    await this.localStore.saveAccessToken(data.accessToken);
    this.accessToken = data.accessToken;

    return data;
  }

  public async logout() {
    // todo: loading from external if not found?
    let tokens: any = {};
    if (this.accessToken) {
      tokens.accessToken = this.accessToken;
    }
    if (this.refreshToken) {
      tokens.refreshToken = this.refreshToken;
    }

    await this.query({
      method: 'POST',
      url: `${this.serverUrl}/v1/auth/revoke`,
      noAuthRequired: true,
      data: tokens
    });

    // Don't delete storage data until after the request.
    // This ensures that in the event that the revoke request fails there is the option to try
    // again rather than just loosing all the tokens.
    await this.localStore.deleteCurrentUser();
    await this.localStore.deleteEncryptionKey();

    await this.localStore.deleteRefreshToken();
    await this.localStore.deleteAccessToken();

    delete this.refreshToken;
    delete this.accessToken;
  }

  private async refresh() {
    if (!this.refreshToken) {
      throw new NoRefreshTokenError();
    }

    let data: RefreshResponse;
    try {
      data = await this.query<RefreshResponse>({
        method: 'POST',
        url: `${this.serverUrl}/v1/auth/refresh`,
        noAuthRequired: true,
        data: {
          refreshToken: this.refreshToken
        }
      });
    }
    catch(e) {
      // If the refresh request fails then fully log the user out to be safe
      await this.logout();

      throw e;
    }

    await this.localStore.saveRefreshToken(data.refreshToken);
    this.refreshToken = data.refreshToken;
    await this.localStore.saveAccessToken(data.accessToken);
    this.accessToken = data.accessToken;

    return data;
  }

  private async getChangeIds() {
    return this.query<string[]>({
      method: 'GET',
      url: `${this.serverUrl}/v1/changes/ids`,
    });
  }

  private async getChanges(changeIds?: string[]) {
    if (!changeIds || changeIds.length === 0) {
      return this.query<ChangeDto[]>({
        method: 'GET',
        url: `${this.serverUrl}/v1/changes`,
      });
    }

    return this.query<ChangeDto[]>({
      method: 'GET',
      url: `${this.serverUrl}/v1/changes`,
      params: {
        ids: changeIds
      }
    });
  }
}
