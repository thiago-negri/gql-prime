import { type CacheType } from "./cache-type";

export interface PublicUserModelCache {
  id: number;
  username: string;
}
export const PUBLIC_USER_MODEL_CACHE: CacheType<PublicUserModelCache> = {
  version: 1,
  name: "pumc",
};

export const NUMBER: CacheType<number> = { version: 1, name: "n" };
