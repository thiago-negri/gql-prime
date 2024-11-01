import type GraphqlDiScope from "../types/graphql-di-scope";
import type CacheArgs from "./cache-args";
import cacheBuildArgs from "./cache-build-args";
import type CacheKey from "./cache-key";
import { type CacheType } from "./cache-type";

interface CacheOptionsComposite<PF extends CacheArgs, PT, T> {
  parentKey: CacheKey<PF, PT>;
  type: CacheType<T>;
  ttlInSeconds: number;
  inMemoryTtlInSeconds?: number;
  writeCallback: (a: PT) => [PF, T];
  readCallback: (a: T) => PF;
}

class CacheKeyComposite<PF extends CacheArgs, PT, F extends CacheArgs, T> {
  readonly kind: "composite" = "composite";

  readonly key: string;
  readonly type: CacheType<T>;
  readonly parentKey: CacheKey<PF, PT>;
  readonly ttlInSeconds: number;
  readonly inMemoryTtlInSeconds?: number;
  readonly resolver: (diScope: GraphqlDiScope, args: F) => Promise<PT | null>;
  readonly writeCallback: (a: PT) => [PF, T];
  readonly readCallback: (a: T) => PF;

  constructor(
    key: string,
    options: CacheOptionsComposite<PF, PT, T> & {
      resolver: (diScope: GraphqlDiScope, args: F) => Promise<PT | null>;
    }
  ) {
    this.key = key;
    this.type = options.type;
    this.parentKey = options.parentKey;
    this.ttlInSeconds = options.ttlInSeconds;
    this.inMemoryTtlInSeconds = options.inMemoryTtlInSeconds;
    this.resolver = options.resolver;
    this.writeCallback = options.writeCallback;
    this.readCallback = options.readCallback;
  }

  build(args: F): string {
    return `${this.key}:${this.type.name}.${this.type.version}?${cacheBuildArgs(args)}`;
  }
}

export default CacheKeyComposite;
