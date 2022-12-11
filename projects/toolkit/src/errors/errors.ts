export interface ToolkitErrorOptions {
    message?: string;
    originalError?: any;
}

export class ToolkitError extends Error {
    originalError: any;

    constructor(options?: ToolkitErrorOptions) {
        if (options?.message) {
            super(options.message);
        }
        else {
            super();
        }

        this.originalError = options?.originalError || null;
    }
}

export class NoServerError extends ToolkitError {}

// Encryption Errors
export class EncryptionError extends ToolkitError {}
export class EncryptError extends EncryptionError {}
export class DecryptError extends EncryptionError {}

// API Client Errors
export class APIClientError extends ToolkitError {}
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

export class NoRefreshTokenError extends APIClientError {}
export class NoAccessTokenError extends APIClientError {}

// Data save/load errors
export class DataLoadError extends APIClientError {}
export class DataSaveError extends APIClientError {}
export class DataDeleteError extends APIClientError {}
