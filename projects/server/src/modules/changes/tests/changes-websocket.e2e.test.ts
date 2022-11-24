import {TestHelper} from "../../../../tests/e2e/test-helper";


describe("Changes Websocket - 'changes' event",() => {
  const testHelper = new TestHelper();

  beforeAll(async () => {
    await testHelper.beforeAll();
  });
  afterAll(async () => {
    await testHelper.afterAll()
  });
  beforeEach(async () => {
    await testHelper.beforeEach()
  });

  describe("Success Cases", () => {
    test("When submitting a new change, Then that change should be saved to the database", async => {
      //todo: write test
      expect(true).toEqual(false);
    })

    test("When submitting a new change, Then that change should be broadcast to other clients of that user", async => {
      //todo: write test
      expect(true).toEqual(false);
    })

    test("When submitting a new change, Then that change should not be broadcast to clients of different users", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
  })

  describe("Invalid Authentication", () => {
    test("Given the user has no authentication, When they attempt to connect to the socket, Then the connection should fail", async => {
      //todo: write test
      expect(true).toEqual(false);
    })

    test("Given a user has no authentication, When they submitting a change, Then they should be sent an error event", async => {
      //todo: write test
      // may not be needed? Preventing connections without valid auth may mean clients can't emit events without auth anyway?
      expect(true).toEqual(false);
    })
    test("Given a user has no authentication, When they submitting a change, the subsequent error event should only be sent to them", async => {
      //todo: write test
      // may not be needed? Preventing connections without valid auth may mean clients can't emit events without auth anyway?
      expect(true).toEqual(false);
    })

    test("Given a user has expired authentication when already connected, When they submitting a change, Then they should be sent an error event", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
    test("Given a user has expired authentication when already connected, When they submitting a change, the subsequent error event should only be sent to them", async => {
      //todo: write test
    })

    test("Given the user has invalid authentication, When they submitting a change, Then they should be sent an error event", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
  })

  describe("None Unique Data", () => {
    test("When they submitting a change with a duplicate ID, Then ....?", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
  })

  describe("Data Validation", () => {
    test("When submitting a change with an invalid ID data type, Then an error event should be received", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
    test("When submitting a change with an invalid ID data type, Then the subsequent error event should only be sent to the original sender", async => {
      //todo: write test
      expect(true).toEqual(false);
    })

    test("When submitting a change with an invalid 'data' data type, Then an error event should be received", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
    test("When submitting a change with an invalid 'data' data type, Then the subsequent error event should only be sent to the original sender", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
  })

  describe("Required Fields", () => {
    test("When submitting a change without an ID field, Then an error event should be received", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
    test("When submitting a change without an ID field, Then the subsequent error event should only be sent to the original sender", async => {
      //todo: write test
      expect(true).toEqual(false);
    })

    test("When submitting a change without a data field, Then an error event should be received", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
    test("When submitting a change without a data field, Then the subsequent error event should only be sent to the original sender", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
  })

  describe("Invalid Data", () => {
    test("When submitting a change with invalid data, Then an error event should be received", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
    test("When submitting a change with invalid data, Then the subsequent error event should only be sent to the original sender", async => {
      //todo: write test
      expect(true).toEqual(false);
    })

    test("When submitting a change with malformed data, Then an error event should be received", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
    test("When submitting a change with malformed data, Then the subsequent error event should only be sent to the original sender", async => {
      //todo: write test
      expect(true).toEqual(false);
    })
  })
})
