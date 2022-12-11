import {LocalStore} from "./storage/local-store";
import * as A from "@automerge/automerge";
import {ChangeDto} from "@ben-ryder/lfb-common";
import {v4 as createUUID} from "uuid";
import {LFBClient} from "./clients/lfb-server-client";
import {BrowserSyncClient} from "./clients/browser-sync-client";
import {NoEncryptionKeyError} from "./errors/errors";
import {EncryptionHelper} from "./encryption/encryption-helper";

/**
 * A listener callback fired whenever a change is made to the document.
 */
export type DocumentUpdateListener<DocType> = (doc: A.Doc<DocType>) => void;

export interface LFBApplicationConfig {
  lfbClient: LFBClient,
  localStore: LocalStore,
  isOnline?: boolean
}

/**
 * The main application that exposes everything required to run
 * an LFB application including Automerge and server interactions.
 */
export class LFBApplication<DocType> {
  private document: A.Doc<DocType>;
  private readonly initialDocument: A.Doc<DocType>;
  private readonly updateListeners: DocumentUpdateListener<DocType>[];
  private isOnline: boolean;

  private readonly localStore: LocalStore;

  private readonly lfbClient: LFBClient;
  private browserSyncClient: BrowserSyncClient<DocType>;

  constructor(initialDocument: A.Doc<DocType>, config: LFBApplicationConfig) {
    this.initialDocument = initialDocument;
    this.document = A.clone(initialDocument);

    this.isOnline = config.isOnline || true;

    this.lfbClient = config.lfbClient;
    this.browserSyncClient = new BrowserSyncClient<DocType>();
    this.localStore = config.localStore;
    this.updateListeners = [];

    this.lfbClient.addChangesListener(this.handleExternalChanges);
  }
  setIsOnline(isOnline: boolean) {
    this.isOnline = isOnline;

    if (isOnline) {
      this.syncWithServer();
    }
  }

  private async handleExternalChanges(changes: ChangeDto[]) {
    const changeIds = await this.localStore.loadAllChangeIds();
    for (const change of changes) {
      if (!changeIds.includes(change.id)) {
        await this.localStore.saveChange(change);
      }
    }

    await this.load();
  }

  async load() {
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

    this.updateDocument(newDocument);

    // Don't await server sync, this lets applications
    this.syncWithServer();
  }

  /**
   * Add a listener to call when the application document updates.
   *
   * @param updateListener
   */
  addUpdateListener(updateListener: DocumentUpdateListener<DocType>) {
    this.updateListeners.push(updateListener);
  }

  async makeChange(changeFunc: A.ChangeFn<DocType>) {
    const encryptionKey = await this.localStore.loadEncryptionKey();
    if (!encryptionKey) {
      throw new NoEncryptionKeyError();
    }

    const updatedDocument = A.change(this.document, changeFunc);
    const rawChange = A.getLastLocalChange(updatedDocument);
    // todo: can I use a patchCallback rather that fetching the last change maybe?

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

  private updateDocument(updatedDocument: A.Doc<DocType>) {
    this.document = updatedDocument;

    for (const listener of this.updateListeners) {
      listener(this.document);
    }
  }

  private async syncWithServer() {
    const localIds = await this.localStore.loadAllChangeIds();
    const serverIds = await this.lfbClient.getChangeIds();

    const newIdsOnServer = serverIds.filter(id => !localIds.includes(id));
    const newIdsOnClient = localIds.filter(id => !serverIds.includes(id));

    if (newIdsOnClient.length > 0) {
      const changesForServer = await this.localStore.loadChanges(newIdsOnClient);
      this.emitChanges(changesForServer);
    }

    if (newIdsOnServer.length > 0) {
      const changesFromServer = await this.lfbClient.getChanges(newIdsOnServer);

      const changeIds = await this.localStore.loadAllChangeIds();
      for (const change of changesFromServer) {
        if (!changeIds.includes(change.id)) {
          await this.localStore.saveChange(change);
        }
      }
    }

    this.load();
  }

  private emitChanges(changes: ChangeDto[]) {
    if (this.isOnline) {
      this.lfbClient.emitChanges(changes);
    }
    else {
      this.browserSyncClient.emitChanges(changes);
    }
  }
}