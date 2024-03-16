import { type FastifyRequest } from 'fastify'
import type UsersData from '../data/users/users-data'
import type AuthService from '../services/auth-service'
import type PublicUserModel from '../models/public-user-model'
import type DatabaseConnectionPool from '../singletons/database-connection-pool'
import { type RedisClient } from '../singletons/redis-client'
import type CacheService from '../services/cache-service'

interface GraphqlDiScope {
  request: FastifyRequest

  // Singletons
  databaseConnectionPool: DatabaseConnectionPool
  redisClient: RedisClient

  // Data
  usersData: UsersData

  // Services
  authService: AuthService
  cacheService: CacheService

  // DI Resolvers
  user: Promise<PublicUserModel | undefined>
}

export default GraphqlDiScope
