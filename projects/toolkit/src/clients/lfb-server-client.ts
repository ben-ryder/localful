import axios from 'axios';

import { EncryptionHelper } from '../encryption/encryption-helper';
import {
  NoAccessTokenError,
  NoEncryptionKeyError,
  NoRefreshTokenError,
  RequestError,
  DataDeleteError,
  DataLoadError,
  DataSaveError
} from '../errors/errors';
import {
  LoginResponse,
  RefreshResponse,
  CreateUserRequest,
  InfoDto,
  CreateUserResponse,
  NoKeysUserDto,
  ErrorIdentifiers,
  ChangeDto,
  ChangesSocketEvents
} from "@ben-ryder/lfb-common";
import {io, Socket} from "socket.io-client";
import {LocalStore} from "../storage/local-store";

export interface QueryOptions {
  url: string,
  method: 'GET'|'POST'|'PATCH'|'DELETE',
  data?: object,
  params?: object,
  noAuthRequired?: boolean,
  requiresEncryptionKey?: boolean
}

export type DataLoader<T> = () => Promise<T|null>;
export type DataSaver<T> = (data: T) => Promise<void>;
export type DataDeleter<T> = () => Promise<void>;

export interface LFBServerClientOptions {
  serverUrl: string;
  localStore: LocalStore,
  handleServerChanges: (changes: ChangeDto[]) => void
}


export class LFBServerClient {
  private readonly socket: Socket
  private readonly options: LFBServerClientOptions;
  private readonly localStore: LocalStore;

  private encryptionKey?: string;
  private accessToken?: string;
  private refreshToken?: string;

  constructor(options: LFBServerClientOptions) {
    this.options = options;
    this.localStore = options.localStore;
    this.socket = io(this.options.serverUrl);

    this.socket.on("changes", (changes: ChangeDto[]) => {
      this.options.handleServerChanges(changes);
    });
  }

  private async query<ResponseType>(options: QueryOptions, repeat = false): Promise<ResponseType> {
    if (!options.noAuthRequired && !this.accessToken) {
      const accessToken = await LFBServerClient.loadData(this.localStore.loadAccessToken);
      const refreshToken = await LFBServerClient.loadData(this.localStore.loadRefreshToken);
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
      const encryptionKey = await LFBServerClient.loadData(this.localStore.loadEncryptionKey);

      if (encryptionKey) {
        this.encryptionKey = encryptionKey;
        return;
      }

      throw new NoEncryptionKeyError();
    }
  }

  // Data Loading
  private static async loadData(loader: DataLoader<any>) {
    try {
      return await loader();
    }
    catch (e) {
      throw new DataLoadError({originalError: e});
    }
  }

  private static async saveData(saver: DataSaver<any>, data: any) {
    try {
      return await saver(data);
    }
    catch (e) {
      throw new DataSaveError({originalError: e});
    }
  }

  private static async deleteData(deleter: DataDeleter<any>) {
    try {
      return await deleter();
    }
    catch (e) {
      throw new DataDeleteError({originalError: e});
    }
  }

  // Info
  async getInfo() {
    return this.query<InfoDto>({
      method: 'GET',
      url: `${this.options.serverUrl}/v1/info`,
      noAuthRequired: true
    });
  }

  // User
  public async login(username: string, password: string) {
    // Convert plain text password into serverPassword and masterKey
    const accountKeys = EncryptionHelper.getAccountKeys(username, password);

    const data = await this.query<LoginResponse>({
      method: 'POST',
      url: `${this.options.serverUrl}/v1/auth/login`,
      data: {
        username,
        password: accountKeys.serverPassword
      },
      noAuthRequired: true
    });

    // Decrypt users encryptionKey with their masterKey
    // todo: don't trust data is encrypted correctly
    const encryptionKey = EncryptionHelper.decryptText(accountKeys.masterKey, data.user.encryptionSecret);
    await LFBServerClient.saveData(this.localStore.saveEncryptionKey, encryptionKey);

    // Save user details and tokens
    await LFBServerClient.saveData(this.localStore.saveCurrentUser, data.user);

    await LFBServerClient.saveData(this.localStore.saveRefreshToken, data.refreshToken);
    this.refreshToken = data.refreshToken;

    await LFBServerClient.saveData(this.localStore.saveAccessToken, data.accessToken);
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
      url: `${this.options.serverUrl}/v1/users`,
      data: user,
      noAuthRequired: true
    });

    await LFBServerClient.saveData(this.localStore.saveEncryptionKey, encryptionKey);
    await LFBServerClient.saveData(this.localStore.saveCurrentUser, data.user);

    await LFBServerClient.saveData(this.localStore.saveRefreshToken, data.refreshToken);
    this.refreshToken = data.refreshToken;
    await LFBServerClient.saveData(this.localStore.saveAccessToken, data.accessToken);
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
      url: `${this.options.serverUrl}/v1/auth/revoke`,
      noAuthRequired: true,
      data: tokens
    });

    // Don't delete storage data until after the request.
    // This ensures that in the event that the revoke request fails there is the option to try
    // again rather than just loosing all the tokens.
    await LFBServerClient.deleteData(this.localStore.deleteCurrentUser);
    await LFBServerClient.deleteData(this.localStore.deleteEncryptionKey);

    await LFBServerClient.deleteData(this.localStore.deleteRefreshToken);
    await LFBServerClient.deleteData(this.localStore.deleteAccessToken);

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
        url: `${this.options.serverUrl}/v1/auth/refresh`,
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

    await LFBServerClient.saveData(this.localStore.saveRefreshToken, data.refreshToken);
    this.refreshToken = data.refreshToken;
    await LFBServerClient.saveData(this.localStore.saveAccessToken, data.accessToken);
    this.accessToken = data.accessToken;

    return data;
  }

  async getChangeIds() {
    return this.query<string[]>({
      method: 'GET',
      url: `${this.options.serverUrl}/v1/changes/ids`,
    });
  }

  async getChanges(changeIds?: string[]) {
    if (!changeIds || changeIds.length === 0) {
      return this.query<ChangeDto[]>({
        method: 'GET',
        url: `${this.options.serverUrl}/v1/changes`,
      });
    }

    return this.query<ChangeDto[]>({
      method: 'GET',
      url: `${this.options.serverUrl}/v1/changes`,
      params: {
        ids: changeIds
      }
    });
  }

  emitChanges(changes: ChangeDto[]) {
    this.socket.volatile.emit(ChangesSocketEvents.changes, changes);
  }
}
