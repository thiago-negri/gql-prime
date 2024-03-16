import { type FastifyRequest } from 'fastify'
import type UsersData from '../data/users/users-data'
import type AuthService from '../services/auth-service'
import type PublicUserModel from '../models/public-user-model'
import type DatabaseConnectionPool from '../singletons/database-connection-pool'
import { type RedisClient } from '../singletons/redis-client'
import type CacheService from '../services/cache-service'
import type SecureProperties from '../secure/types/secure-properties'
import type UsersDataLoader from '../dataloaders/users/users-data-loader'

interface GraphqlDiScope {
  request: FastifyRequest

  // Singletons
  secureProperties: SecureProperties
  databaseConnectionPool: DatabaseConnectionPool
  redisClient: RedisClient

  // Data
  usersData: UsersData

  // DataLoaders
  usersDataLoader: UsersDataLoader

  // Services
  authService: AuthService
  cacheService: CacheService

  // DI Resolvers
  user: Promise<PublicUserModel | undefined>
}

export default GraphqlDiScope
