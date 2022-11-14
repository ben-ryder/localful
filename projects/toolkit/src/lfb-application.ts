import {LocalStore} from "./storage/local-store";
import * as A from "@automerge/automerge";
import {ChangeDto} from "@ben-ryder/lfb-common";
import {v4 as createUUID} from "uuid";

/**
 * A listener callback fired whenever a change is made to the document.
 */
export type UpdateListener<DocType> = (doc: A.Doc<DocType>) => void;

export interface LFBApplicationConfig {
  localStore?: LocalStore,
  isOnline?: boolean
}

/**
 * The main application that exposes everything required to run
 * an LFB application including Automerge and server interactions.
 */
export class LFBApplication<DocType> {
  private document: A.Doc<DocType>;
  private readonly initialDocument: A.Doc<DocType>;
  private readonly updateListeners: UpdateListener<DocType>[];
  private readonly localStore: LocalStore;

  constructor(serverUrl: string, initialDocument: A.Doc<DocType>, config?: LFBApplicationConfig) {
    this.initialDocument = initialDocument;
    this.document = A.clone(initialDocument);
    this.localStore = config?.localStore || new LocalStore();
    this.updateListeners = [];
  }

  async load() {
    const changes = await this.localStore.loadAllChanges();

    const decodedChanges = changes.map(change => {
      return new Uint8Array([...atob(change.data)].map(char => char.charCodeAt(0))) as A.Change;
    });

    const [newDocument] = A.applyChanges<DocType>(A.clone(this.initialDocument), decodedChanges);
    this.updateDocument(newDocument);
  }

  /**
   * Add a listener to call when the application document updates.
   *
   * @param updateListener
   */
  addUpdateListener(updateListener: UpdateListener<DocType>) {
    this.updateListeners.push(updateListener);
  }

  async makeChange(changeFunc: A.ChangeFn<DocType>) {
    const updatedDocument = A.change(this.document, changeFunc);
    const rawChange = A.getLastLocalChange(updatedDocument);
    // todo: can I use a patchCallback rather that fetching the last change maybe?

    // @ts-ignore - todo: fix this being required
    const encodedChange = btoa(String.fromCharCode(...rawChange));

    const change: ChangeDto = {
      id: createUUID(),
      data: encodedChange
    };

    await this.localStore.saveChange(change);

    this.updateDocument(updatedDocument);
  }

  private updateDocument(updatedDocument: A.Doc<DocType>) {
    this.document = updatedDocument;

    for (const listener of this.updateListeners) {
      listener(this.document);
    }
  }
}