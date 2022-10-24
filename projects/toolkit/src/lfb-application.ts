import {LFBServerClient} from "./clients/lfb-server-client";
import {LocalStore} from "./storage/local-store";
import * as A from "@automerge/automerge";
import {EncryptionHelper} from "./encryption/encryption-helper";
import {ChangeDto} from "@ben-ryder/lfb-common";
import {v4 as createUUID} from "uuid";
import {BrowserSyncClient} from "./clients/browser-sync-client";
import {NoEncryptionKeyError} from "./errors/errors";

export type UpdateListener<DocType> = (doc: A.Doc<DocType>) => void;

export interface LFBApplicationOptions<DocType> {
  serverUrl: string,
  initialDocument: A.Doc<DocType>
}


export class LFBApplication<DocType> {
  document: A.Doc<DocType>;
  options: LFBApplicationOptions<DocType>;
  isOnline: boolean;
  updateListeners: UpdateListener<DocType>[];

  serverClient: LFBServerClient;
  localStore: LocalStore;
  browserSyncClient: BrowserSyncClient<DocType>

  constructor(options: LFBApplicationOptions<DocType>) {
    this.options = options;
    this.document = A.clone(this.options.initialDocument);
    this.isOnline = navigator.onLine;
    this.updateListeners = [];

    this.localStore = new LocalStore();
    this.serverClient = new LFBServerClient({
      serverUrl: this.options.serverUrl,
      localStore: this.localStore,
      handleServerChanges: this.handleServerChanges
    });
    this.browserSyncClient = new BrowserSyncClient<DocType>();
    this.browserSyncClient.addChangeListener(this.handleServerChanges);

    window.addEventListener("online", () => {
      this.isOnline = true;
    });
    window.addEventListener("offline", () => {
      this.isOnline = false;
    });

    this.syncWithServer();
  }

  setIsOnline(isOnline: boolean) {
    this.isOnline = isOnline;

    if (isOnline) {
      this.syncWithServer();
    }
  }

  addUpdateListener(updateListener: UpdateListener<DocType>) {
    this.updateListeners.push(updateListener);
  }

  updateDocument(updatedDocument: A.Doc<DocType>) {
    this.document = updatedDocument;

    for (const listener of this.updateListeners) {
      listener(this.document);
    }
  }

  async loadDocument() {
    const encryptionKey = await this.localStore.loadEncryptionKey();
    if (!encryptionKey) {
      throw new NoEncryptionKeyError();
    }

    const encryptedChanges = await this.localStore.loadAllChanges();
    const changes = encryptedChanges.map(encryptedChange => {
      const change = EncryptionHelper.decryptText(encryptionKey, encryptedChange.data).replaceAll("\"", "");
      return new Uint8Array([...atob(change)].map(char => char.charCodeAt(0))) as A.Change;
    });
    const [newDocument] = A.applyChanges<DocType>(A.clone(this.options.initialDocument), changes);

    this.updateDocument(newDocument);
  }

  private async handleServerChanges(changes: ChangeDto[]) {
    const changeIds = await this.localStore.loadAllChangeIds();
    for (const change of changes) {
      if (!changeIds.includes(change.id)) {
        await this.localStore.saveChange(change);
      }
    }

    this.loadDocument();
  }

  private emitChanges(changes: ChangeDto[]) {
    if (this.isOnline) {
      this.serverClient.emitChanges(changes);
    }
    else {
      this.browserSyncClient.emitChanges(changes);
    }
  }

  async syncWithServer() {
    const localIds = await this.localStore.loadAllChangeIds();
    const serverIds = await this.serverClient.getChangeIds();

    const newIdsOnServer = serverIds.filter(id => !localIds.includes(id));
    const newIdsOnClient = localIds.filter(id => !serverIds.includes(id));

    if (newIdsOnClient.length > 0) {
      const changesForServer = await this.localStore.loadChanges(newIdsOnClient);
      this.emitChanges(changesForServer);
    }

    if (newIdsOnServer.length > 0) {
      const changesFromServer = await this.serverClient.getChanges(newIdsOnServer);

      const changeIds = await this.localStore.loadAllChangeIds();
      for (const change of changesFromServer) {
        if (!changeIds.includes(change.id)) {
          await this.localStore.saveChange(change);
        }
      }
    }

    this.loadDocument();
  }

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
}
