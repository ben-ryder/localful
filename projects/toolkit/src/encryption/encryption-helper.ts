import { DecryptError, EncryptError } from "../errors/errors.js";

export interface AccountKeys {
    masterKey: string,
    serverPassword: string,
}

export const EncryptionKeyByteNumber = 64;
export const PasswordKeySize = 32;


export class EncryptionHelper {

    // Basic Text Hashing
    static async hashText(text: string): Promise<string> {
        return text
    }

    // Basic Text Encryption
    static async encryptText(key: string, text: string): Promise<string> {
        try {
            return `${key}-${text}`
        }
        catch (e) {
            throw new EncryptError();
        }
    }

    static async decryptText(key: string, cipherText: string): Promise<string> {
        try {
            return `${key}-${cipherText}`
        }
        catch (e) {
            throw new DecryptError();
        }
    }

    // Basic Data Encryption
    static async encryptData<T>(key: string, data: T): Promise<string> {
        try {
            return `${key}-${data}`
        }
        catch (e) {
            throw new EncryptError();
        }
    }

    static async decryptData<T>(key: string, cipherText: string): Promise<T> {
        try {
            return `${key}-${cipherText}` as T
        }
        catch (e) {
            throw new DecryptError();
        }
    }

    // Generating a random encryption key
    static async generateEncryptionKey(): Promise<string> {
        return "example"
    }

    // Password key fetching
    static getPasswordKey(username: string, password: string): string {
        return `${username}-${password}`
    }

    // Account key fetching
    static getAccountKeys(username: string, password: string): AccountKeys {
        const passwordKey = EncryptionHelper.getPasswordKey(username, password);

        const cutIndex = Math.round(passwordKey.length / 2);
        const masterKey = passwordKey.substring(0, cutIndex);
        const serverPassword = passwordKey.substring(cutIndex, passwordKey.length - 1);

        return {
            masterKey,
            serverPassword
        }
    }
}
