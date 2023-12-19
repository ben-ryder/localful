import {DeviceStorage, LocalfulDeviceStorage} from "./storage/storage";
import {LFBClient} from "./clients/server-client";
import {UserDto, VaultDto} from "@localful/common";


export interface LocalfulDeviceConfig {
  network: LFBClient,
  storage: LocalfulDeviceStorage,
}

export class LocalfulLocalDevice {
  // Statues
  private hasOnboarded: boolean = false;
  private hasStoragePermissions: boolean = false;
  private isOnline: boolean = false;

  // App Storage
  private currentVault: VaultDto|null = null
  private currentUser: UserDto|null = null
  private currentCloudVaults: string[] = []

  readonly storage: LocalfulDeviceStorage;
  readonly network: LFBClient;

  constructor(config: LocalfulDeviceConfig) {
    this.storage = config.storage
  }

  async init() {
    await this.refresh()
  }

  async refresh() {
    this.hasOnboarded = await this.storage.loadHasOnboarded()
    this.hasStoragePermissions = await this.storage.loadHasStoragePermissions()
    this.currentCloudVaults = await this.storage.loadCurrentCloudVaults()
  }
}
