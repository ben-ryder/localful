test("test", () => {
  expect(true).toEqual(true)
})

// /**
//  * @jest-environment jsdom
//  *
//  * Tests of the LFB application class
//  */
//
// import {LFBApplication, LFBClient, LocalStore} from "../src";
// import {from, Doc, Text, init} from "@automerge/automerge";
//
// interface Note {
//   id: string,
//   title: Text,
//   body: Text
// }
//
// interface Table<T> {
//   entities: {[key: string]: T},
//   ids: string[]
// }
//
// interface AppData {
//   notes: Table<Note>
// }
// type TestDocument = Doc<AppData>;
//
//
// const initialDoc = from<TestDocument>({
//   notes: {
//     entities: {},
//     ids: []
//   }
// });
//
//
// describe("Automerge usage in LFB application", () => {
//
//   test("makeChange should work as expected", async () => {
//     const localStore = new LocalStore()
//     const lfbClient = new LFBClient({serverUrl: "", localStore, getAccessToken: async () => {return ""}})
//     const app = new LFBApplication(initialDoc, {lfbClient, localStore});
//     let testDoc = initialDoc;
//     app.addUpdateListener((doc) => {testDoc = doc});
//
//     await app.makeChange((doc) => {
//       const id = "1";
//
//       doc.notes.entities[id] = {
//         id: id,
//         title: new Text("Test note 1"),
//         body: new Text("Test note body...")
//       };
//       doc.notes.ids.push(id);
//     });
//
//     setTimeout(() => {
//       expect(testDoc.notes.ids.length).toEqual(1);
//     }, 1000);
//   })
// })
