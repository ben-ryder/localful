import {EncryptionHelper} from "./encryption-helper";


test('encrypt and decrypt a string', async () => {
    const secret = "ibiova86g9q438ogr8wofw4";
    const inputText = "this is some test data";

    const cipherText = await EncryptionHelper.encryptText(secret, inputText);
    const decryptedText = await EncryptionHelper.decryptText(secret, cipherText);

    expect(decryptedText).toBe(inputText);
})

test('encrypt and decrypt a number', async () => {
    const secret = "sjdfboa68934giu4twc";
    const inputNumber = 42.22;

    const cipherText = await EncryptionHelper.encryptData<number>(secret, inputNumber);
    const decryptedNumber = await EncryptionHelper.decryptData<number>(secret, cipherText);

    expect(inputNumber).toBe(decryptedNumber);
})

test('encrypt and decrypt an object', async () => {
    const secret = "szdjnviusvg8aie4lkhtbwvioevhk4swtc9goilkshv4t";

    interface InputObject {
        testField: string,
        count: number,
        isThing: boolean,
        nested: {
            anotherField: string;
        }
    }

    const inputObject = <InputObject> {
        testField: "test-value",
        count: 2,
        nested: {
            anotherField: "text"
        }
    };

    const cipherText = await EncryptionHelper.encryptData<InputObject>(secret, inputObject);
    const decryptedObject = await EncryptionHelper.decryptData<InputObject>(secret, cipherText);

    expect(decryptedObject).toEqual(inputObject);
})
