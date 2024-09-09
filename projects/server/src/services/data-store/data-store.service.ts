import {Redis} from "ioredis";

import {ConfigService} from "@services/config/config.service.js";
import {SystemError} from "@services/errors/base/system.error.js";
import {Injectable} from "@ben-ryder/decoject";

export interface CacheOptions {
  epochExpiry: number;
}

@Injectable()
export class DataStoreService {
  private redis: Redis | null = null;

  constructor(private configService: ConfigService) {}

  private async getRedis(): Promise<Redis> {
    if (this.redis) {
      return this.redis
    }
    else {
      this.redis = new Redis(this.configService.config.dataStore.redisUrl)
      return this.redis
    }
  }

  // todo: improve health check at all? stop ioredis logging to console but still expose errors?
  async healthCheck(): Promise<boolean> {
    try {
      const redis = await this.getRedis();
      await redis.ping()
      return true
    }
    catch (error) {
      return false;
    }
  }

  async addItem(key: string, value: string, options?: CacheOptions) {
    const redis = await this.getRedis();

    try {
      if (options?.epochExpiry) {
        await redis.set(key, value, "EXAT", options.epochExpiry);
      }
      else {
        await redis.set(key, value);
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
    const redis = await this.getRedis();

    try {
      // Using !! to convert 0/1 to false/true
      return !!(await redis.exists(key));
    }
    catch (e) {
      throw new SystemError({
        message: "Error fetching item from data store",
        originalError: e,
      });
    }
  }

  async getItem(key: string) {
    const redis = await this.getRedis();
    return redis.get(key);
  }

  async purge() {
    const redis = await this.getRedis();
    await redis.flushall();
  }

  async onModuleDestroy() {
    const redis = await this.getRedis();
    redis.disconnect();
  }
}
