import { type FastifyRequest } from "fastify";
import type UsersData from "../data/users/users-data";
import type AuthService from "../services/auth-service";
import type PublicUserModel from "../models/public-user-model";
import type DatabaseConnectionPool from "../singletons/database-connection-pool";
import { type RedisClient } from "../singletons/redis-client";
import type CacheService from "../services/cache-service";
import type SecureProperties from "../secure/types/secure-properties";
import type UsersDataLoader from "../dataloaders/users/users-data-loader";
import type InMemoryCacheService from "../services/in-memory-cache-service";

interface AppDiScope {
  readonly secureProperties: SecureProperties;
  readonly databaseConnectionPool: DatabaseConnectionPool;
  readonly redisClient: RedisClient;
  readonly authService: AuthService;
}

interface RequestDiScope {
  readonly request: FastifyRequest;

  // Data
  readonly usersData: UsersData;

  // DataLoaders
  readonly usersDataLoader: UsersDataLoader;

  // Services
  readonly inMemoryCacheService: InMemoryCacheService;
  readonly cacheService: CacheService;

  // DI Resolvers
  readonly userPromise: Promise<PublicUserModel | undefined>;
}

type GraphqlDiScope = AppDiScope & RequestDiScope;

export default GraphqlDiScope;
