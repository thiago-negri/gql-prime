import { type RESOLVER, type ResolverOptions } from "awilix";

interface AwilixFunction<T> {
  (): T;
  [RESOLVER]: ResolverOptions<T>;
}

export default AwilixFunction;
