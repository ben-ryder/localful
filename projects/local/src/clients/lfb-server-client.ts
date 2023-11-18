import { EncryptionHelper } from '../encryption/encryption-helper.js';
import {
  NoEncryptionKeyError,
  RequestError,
  DataDeleteError,
  DataLoadError,
  DataSaveError
} from '../errors/errors.js';
import {
  InfoDto,
  ErrorIdentifiers,
  ChangeDto,
  ChangesSocketEvents, ProfileUpdateDto, ProfileDto
} from "@localful/common";
import {io, Socket} from "socket.io-client";
import {LocalStore} from "../storage/local-store";
import {ChangesListener} from "../common/changes-listener";

export interface QueryOptions {
  url: string,
  method: 'GET'|'POST'|'PATCH'|'DELETE',
  data?: object,
  params?: URLSearchParams,
  noAuthRequired?: boolean
}

export type DataLoader<T> = () => Promise<T|null>;
export type DataSaver<T> = (data: T) => Promise<void>;
export type DataDeleter<T> = () => Promise<void>;

export interface LFBClientConfig {
  serverUrl: string;
  localStore: LocalStore,
  getAccessToken: () => Promise<string>
}


export class LFBClient {
  private readonly socket: Socket
  private readonly config: LFBClientConfig;
  private readonly localStore: LocalStore;
  private readonly changeListeners: ChangesListener[] = [];

  constructor(config: LFBClientConfig) {
    this.config = config;
    this.localStore = config.localStore;
    this.socket = io(this.config.serverUrl);

    this.socket.on("changes", async (changes: ChangeDto[]) => {
      await this.handleServerChanges(changes);
    });
  }

  // Change Listeners
  private async handleServerChanges(changes: ChangeDto[]) {
    for (const listener of this.changeListeners) {
      await listener(changes);
    }
  }

  addChangesListener(listener: ChangesListener) {
    this.changeListeners.push(listener);
  }

  // Basic Query
  private async query<ResponseType>(options: QueryOptions, repeat = false): Promise<ResponseType> {
    let headers: Headers = new Headers({"Content-Type": "application/json"})
    if (!options.noAuthRequired) {
      const accessToken = await this.config.getAccessToken();
      headers.set("Authorization", `Bearer ${accessToken}`)
    }

    let url =
      options.params && Array.from(options.params.keys()).length > 0
        ? `${options.url}?${options.params.toString()}`: options.url

    try {
      const response = await fetch(
        url,
        {
          method: options.method,
          body: JSON.stringify(options.data),
          headers
      });
      return await response.json()
    }
    catch (e: any) {
      throw new RequestError(
        {
          message: `There was an error with the request '${options.url} [${options.method}]'`,
          originalError: e,
          response: e.response?.data
        }
      );
    }
  }

  // Data Loading
  // private static async loadData(loader: DataLoader<any>) {
  //   try {
  //     return await loader();
  //   }
  //   catch (e) {
  //     throw new DataLoadError({originalError: e});
  //   }
  // }
  //
  // private static async saveData(saver: DataSaver<any>, data: any) {
  //   try {
  //     return await saver(data);
  //   }
  //   catch (e) {
  //     throw new DataSaveError({originalError: e});
  //   }
  // }
  //
  // private static async deleteData(deleter: DataDeleter<any>) {
  //   try {
  //     return await deleter();
  //   }
  //   catch (e) {
  //     throw new DataDeleteError({originalError: e});
  //   }
  // }

  // Info
  async getInfo() {
    return this.query<InfoDto>({
      method: 'GET',
      url: `${this.config.serverUrl}/v1/info`,
      noAuthRequired: true
    });
  }

  // Profiles
  async getProfile(userId: string) {
    return this.query<ProfileDto>({
      method: 'GET',
      url: `${this.config.serverUrl}/v1/profiles/${userId}`,
    });
  }

  async deleteProfile(userId: string) {
    return this.query<void>({
      method: 'DELETE',
      url: `${this.config.serverUrl}/v1/profiles/${userId}`,
    });
  }

  async updateProfile(userId: string, update: ProfileUpdateDto) {
    return this.query<ProfileDto>({
      method: 'PATCH',
      url: `${this.config.serverUrl}/v1/profiles/${userId}`,
      data: update
    });
  }

  // todo: add setup now server uses third party SSO for actual login, but profiles
  // are still fetched/managed in the API.
  // User
  // public async init(userId: string) {
  //
  //   let profile: ProfileDto | null = null
  //   try {
  //     profile = await this.getProfile(userId)
  //   }
  //   catch (e) {
  //     if (e?.response?.type !== ErrorIdentifiers.PROFILE_NOT_FOUND) {
  //       throw e;
  //     }
  //   }
  //
  //
  //   // Convert plain text password into serverPassword and masterKey
  //   const accountKeys = await EncryptionHelper.getAccountKeys(username, password);
  //
  //   const data = await this.query<LoginResponse>({
  //     method: 'POST',
  //     url: `${this.options.serverUrl}/v1/auth/login`,
  //     data: {
  //       username,
  //       password: accountKeys.serverPassword
  //     },
  //     noAuthRequired: true
  //   });
  //
  //   // Decrypt users encryptionKey with their masterKey
  //   // todo: don't trust data is encrypted correctly
  //   const encryptionKey = await EncryptionHelper.decryptText(accountKeys.masterKey, data.user.encryptionSecret);
  //   await LFBClient.saveData(this.localStore.saveEncryptionKey, encryptionKey);
  //
  //   // Save user details and tokens
  //   await LFBClient.saveData(this.localStore.saveCurrentUser, data.user);
  //
  //   await LFBClient.saveData(this.localStore.saveRefreshToken, data.refreshToken);
  //   this.refreshToken = data.refreshToken;
  //
  //   await LFBClient.saveData(this.localStore.saveAccessToken, data.accessToken);
  //   this.accessToken = data.accessToken;
  //
  //   return data;
  // }

  // Changes
  async getChangeIds() {
    return this.query<string[]>({
      method: 'GET',
      url: `${this.config.serverUrl}/v1/changes/ids`,
    });
  }

  async getChanges(changeIds?: string[]) {
    if (!changeIds || changeIds.length === 0) {
      return this.query<ChangeDto[]>({
        method: 'GET',
        url: `${this.config.serverUrl}/v1/changes`,
      });
    }

    const params = new URLSearchParams()
    for (const id of changeIds) {
      params.append("ids", id)
    }

    return this.query<ChangeDto[]>({
      method: 'GET',
      url: `${this.config.serverUrl}/v1/changes`,
      params
    });
  }

  emitChanges(changes: ChangeDto[]) {
    // todo: fix type issue here
    // @ts-ignore
    this.socket.volatile.emit(ChangesSocketEvents.changes, changes);
  }
}
