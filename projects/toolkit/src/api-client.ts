import axios from 'axios';

import { EncryptionHelper } from './encryption/encryption-helper';
import {
  NoAccessTokenError,
  NoEncryptionKeyError,
  NoRefreshTokenError,
  RequestError,
  DataDeleteError,
  DataLoadError,
  DataSaveError
} from './errors/errors';
import {UserDto, LoginResponse, RefreshResponse, CreateUserRequest, InfoDto, CreateUserResponse, NoKeysUserDto, ErrorIdentifiers} from "@ben-ryder/lfb-common";

export interface QueryOptions {
  url: string,
  method: 'GET'|'POST'|'PATCH'|'DELETE',
  data?: object,
  params?: object,
  noAuthRequired?: boolean,
  requiresEncryptionKey?: boolean
}

export type DataLoader<T> = () => Promise<T|null>;
export type DataSaver<T> = (data: T) => Promise<void>;
export type DataDeleter<T> = () => Promise<void>;

export interface APIClientOptions {
  apiEndpoint: string;

  saveEncryptionKey: DataSaver<string>;
  loadEncryptionKey: DataLoader<string>;
  deleteEncryptionKey: DataDeleter<string>;

  loadAccessToken: DataLoader<string>;
  saveAccessToken: DataSaver<string>;
  deleteAccessToken: DataDeleter<string>;

  loadRefreshToken: DataLoader<string>;
  saveRefreshToken: DataSaver<string>;
  deleteRefreshToken: DataDeleter<string>;

  loadCurrentUser: DataLoader<UserDto>;
  saveCurrentUser: DataSaver<UserDto>;
  deleteCurrentUser: DataDeleter<UserDto>;
}

export class APIClient {
  private readonly options: APIClientOptions;
  private encryptionKey?: string;
  private accessToken?: string;
  private refreshToken?: string;

  constructor(options: APIClientOptions) {
    this.options = options;
  }

  private async query<ResponseType>(options: QueryOptions, repeat = false): Promise<ResponseType> {
    if (!options.noAuthRequired && !this.accessToken) {
      const accessToken = await APIClient.loadData(this.options.loadAccessToken);
      const refreshToken = await APIClient.loadData(this.options.loadRefreshToken);
      if (refreshToken) {
        this.refreshToken = refreshToken;
      }
      else {
        throw new NoRefreshTokenError();
      }

      if (accessToken) {
        this.accessToken = accessToken;
      }
      else if (!repeat) {
        return this.refreshAuthAndRetry(options);
      }
      else {
        throw new NoAccessTokenError();
      }
    }


    let response: any = null;
    try {
      response = await axios({
        ...options,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
    }
    catch (e: any) {
      if (e.response?.data?.identifier === ErrorIdentifiers.ACCESS_UNAUTHORIZED && !repeat) {
        return this.refreshAuthAndRetry<ResponseType>(options);
      }

      throw new RequestError(
        {
          message: `There was an error with the request '${options.url} [${options.method}]'`,
          originalError: e,
          response: e.response?.data
        }
      );
    }

    return response.data;
  }

  private async refreshAuthAndRetry<ResponseType>(options: QueryOptions): Promise<ResponseType> {
    await this.refresh();
    return this.query(options, true);
  }

  private async checkEncryptionKey() {
    if (!this.encryptionKey) {
      const encryptionKey = await APIClient.loadData(this.options.loadEncryptionKey);

      if (encryptionKey) {
        this.encryptionKey = encryptionKey;
        return;
      }

      throw new NoEncryptionKeyError();
    }
  }

  // Data Loading
  private static async loadData(loader: DataLoader<any>) {
    try {
      return await loader();
    }
    catch (e) {
      throw new DataLoadError({originalError: e});
    }
  }

  private static async saveData(saver: DataSaver<any>, data: any) {
    try {
      return await saver(data);
    }
    catch (e) {
      throw new DataSaveError({originalError: e});
    }
  }

  private static async deleteData(deleter: DataDeleter<any>) {
    try {
      return await deleter();
    }
    catch (e) {
      throw new DataDeleteError({originalError: e});
    }
  }

  // Info
  async getInfo() {
    return this.query<InfoDto>({
      method: 'GET',
      url: `${this.options.apiEndpoint}/v1/info`,
      noAuthRequired: true
    });
  }

  // User
  public async login(username: string, password: string) {
    // Convert plain text password into serverPassword and masterKey
    const accountKeys = EncryptionHelper.getAccountKeys(username, password);

    const data = await this.query<LoginResponse>({
      method: 'POST',
      url: `${this.options.apiEndpoint}/v1/auth/login`,
      data: {
        username,
        password: accountKeys.serverPassword
      },
      noAuthRequired: true
    });

    // Decrypt users encryptionKey with their masterKey
    // todo: don't trust data is encrypted correctly
    const encryptionKey = EncryptionHelper.decryptText(accountKeys.masterKey, data.user.encryptionSecret);
    await APIClient.saveData(this.options.saveEncryptionKey, encryptionKey);

    // Save user details and tokens
    await APIClient.saveData(this.options.saveCurrentUser, data.user);

    await APIClient.saveData(this.options.saveRefreshToken, data.refreshToken);
    this.refreshToken = data.refreshToken;

    await APIClient.saveData(this.options.saveAccessToken, data.accessToken);
    this.accessToken = data.accessToken;

    return data;
  }

  public async register(noKeysUser: NoKeysUserDto) {
    // Get user account keys from plain text password and overwrite the user password.
    const accountKeys = EncryptionHelper.getAccountKeys(noKeysUser.username, noKeysUser.password);

    // Generate the user's encryptionSecret
    const encryptionKey = EncryptionHelper.generateEncryptionKey();
    const encryptionSecret = EncryptionHelper.encryptText(accountKeys.masterKey, encryptionKey);

    const user: CreateUserRequest = {
      username: noKeysUser.username,
      email: noKeysUser.email,
      password: accountKeys.serverPassword,
      encryptionSecret
    }

    const data = await this.query<CreateUserResponse>({
      method: 'POST',
      url: `${this.options.apiEndpoint}/v1/users`,
      data: user,
      noAuthRequired: true
    });

    await APIClient.saveData(this.options.saveEncryptionKey, encryptionKey);
    await APIClient.saveData(this.options.saveCurrentUser, data.user);

    await APIClient.saveData(this.options.saveRefreshToken, data.refreshToken);
    this.refreshToken = data.refreshToken;
    await APIClient.saveData(this.options.saveAccessToken, data.accessToken);
    this.accessToken = data.accessToken;

    return data;
  }

  public async logout() {
    // todo: loading from external if not found?
    let tokens: any = {};
    if (this.accessToken) {
      tokens.accessToken = this.accessToken;
    }
    if (this.refreshToken) {
      tokens.refreshToken = this.refreshToken;
    }

    await this.query({
      method: 'POST',
      url: `${this.options.apiEndpoint}/v1/auth/revoke`,
      noAuthRequired: true,
      data: tokens
    });

    // Don't delete storage data until after the request.
    // This ensures that in the event that the revoke request fails there is the option to try
    // again rather than just loosing all the tokens.
    await APIClient.deleteData(this.options.deleteCurrentUser);
    await APIClient.deleteData(this.options.deleteEncryptionKey);

    await APIClient.deleteData(this.options.deleteRefreshToken);
    await APIClient.deleteData(this.options.deleteAccessToken);

    delete this.refreshToken;
    delete this.accessToken;
  }

  private async refresh() {
    if (!this.refreshToken) {
      throw new NoRefreshTokenError();
    }

    let data: RefreshResponse;
    try {
      data = await this.query<RefreshResponse>({
        method: 'POST',
        url: `${this.options.apiEndpoint}/v1/auth/refresh`,
        noAuthRequired: true,
        data: {
          refreshToken: this.refreshToken
        }
      });
    }
    catch(e) {
      // If the refresh request fails then fully log the user out to be safe
      await this.logout();

      throw e;
    }

    await APIClient.saveData(this.options.saveRefreshToken, data.refreshToken);
    this.refreshToken = data.refreshToken;
    await APIClient.saveData(this.options.saveAccessToken, data.accessToken);
    this.accessToken = data.accessToken;

    return data;
  }
}
