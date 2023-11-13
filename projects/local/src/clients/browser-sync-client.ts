import {ChangeDto} from "@localful/common";
import {ChangesListener} from "../common/changes-listener.js";


export class BrowserSyncClient<DocType> {
  browserChannel: BroadcastChannel;
  changeListeners: ChangesListener[];

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

  addChangesListener(listener: ChangesListener) {
    this.changeListeners.push(listener);
  }
}
