import {ChangeDto} from "@ben-ryder/lfb-common";

export type ChangeListener = (changes: ChangeDto[]) => void;


export class BrowserSyncClient<DocType> {
  browserChannel: BroadcastChannel;
  changeListeners: ChangeListener[];

  constructor() {
    this.browserChannel = new BroadcastChannel("changes");
    this.changeListeners = [];

    this.browserChannel.onmessage = (event: MessageEvent<{type: "changes", changes: ChangeDto[]}>) => {
      if (event.data.type === "changes") {
        this.callListeners(event.data.changes);
      }
    };
  }

  private callListeners(changes: ChangeDto[]) {
    for (const listener of this.changeListeners) {
      listener(changes);
    }
  }

  emitChanges(changes: ChangeDto[]) {
    this.browserChannel.postMessage({type: "changes", changes: changes});
  }

  addChangeListener(listener: ChangeListener) {
    this.changeListeners.push(listener);
  }
}
