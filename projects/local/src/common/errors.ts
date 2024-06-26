export interface LocalfulErrorOptions {
    message?: string;
    originalError?: any;
}

export class LocalfulError extends Error {
    originalError: any;

    constructor(options?: LocalfulErrorOptions) {
        if (options?.message) {
            super(options.message);
        }
        else {
            super();
        }

        this.originalError = options?.originalError || null;
    }
}

export class NoServerError extends LocalfulError {}

// Encryption Errors
export class EncryptionError extends LocalfulError {}
export class EncryptError extends EncryptionError {}
export class DecryptError extends EncryptionError {}

// API Client Errors
export class APIClientError extends LocalfulError {}
export class NoEncryptionKeyError extends APIClientError {}

export interface RequestErrorOptions {
    message?: string;
    originalError?: any;
    response?: any
}

export class RequestError extends APIClientError {
    response: any;

    constructor(options?: RequestErrorOptions) {
        super(options);
        this.response = options?.response;
    }
}

// Data save/load errors
export class DataLoadError extends APIClientError {}
export class DataSaveError extends APIClientError {}
export class DataDeleteError extends APIClientError {}
