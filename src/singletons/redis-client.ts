import { createClient } from "redis";
import type RedisConfig from "../secure/types/redis-config";

export interface RedisClient {
  set: (
    key: string,
    value: string,
    ttlInSeconds: number
  ) => Promise<string | null>;
  get: (key: string) => Promise<string | null>;
  mget: (keys: string[]) => Promise<Array<string | null>>;
  del: (key: string | string[]) => Promise<number>;
}

async function redisClient(redisConfig: RedisConfig): Promise<RedisClient> {
  const client = createClient(redisConfig);
  await client.connect();
  return {
    set: async (key, value, ttlInSeconds) =>
      await client.set(key, value, { EX: ttlInSeconds }),
    get: async (key) => await client.get(key),
    mget: async (keys) => await client.mGet(keys),
    del: async (key) => await client.del(key),
  };
}

export default redisClient;
