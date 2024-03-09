import { type FastifyRequest } from 'fastify'
import type UsersData from '../data/users/users-data'
import type AuthService from '../services/auth-service'
import type PublicUserModel from '../models/public-user-model'
import type DatabaseConnectionPool from '../services/database-connection-pool'
import type SecureProperties from './secure-properties'

interface GraphqlDiScope {
  request: FastifyRequest
  secureProperties: SecureProperties
  databaseConnectionPool: DatabaseConnectionPool
  usersData: UsersData
  authService: AuthService
  user: Promise<PublicUserModel | undefined>
}

export default GraphqlDiScope
