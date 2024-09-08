import {Redis} from "ioredis";

import configService, {ConfigService} from "@services/config/config.service.js";
import {SystemError} from "@services/errors/base/system.error.js";


export interface CacheOptions {
  epochExpiry: number;
}


export class DataStoreService {
  private redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis(configService.config.dataStore.redisUrl);
  }

  checkStatus() {
    if (this.redis.status !== "ready") {
      throw new SystemError({
        message: "Redis connection has not been established.",
      });
    }
  }

  async addItem(key: string, value: string, options?: CacheOptions) {
    this.checkStatus();

    try {
      if (options?.epochExpiry) {
        await this.redis.set(key, value, "EXAT", options.epochExpiry);
      }
      else {
        await this.redis.set(key, value);
      }
    }
    catch (e) {
      throw new SystemError({
        message: "Error adding item to data store",
        originalError: e,
      });
    }
  }

  async itemExists(key: string): Promise<boolean> {
    this.checkStatus();

    try {
      // Using !! to convert 0/1 to false/true
      return !!(await this.redis.exists(key));
    }
    catch (e) {
      throw new SystemError({
        message: "Error fetching item from data store",
        originalError: e,
      });
    }
  }

  async getItem(key: string) {
    this.checkStatus();

    return this.redis.get(key);
  }

  async purge() {
    this.checkStatus();

    await this.redis.flushall();
  }

  async onModuleDestroy() {
    this.redis.disconnect();
  }
}


const dataStoreService = new DataStoreService(configService)
export default dataStoreService;
