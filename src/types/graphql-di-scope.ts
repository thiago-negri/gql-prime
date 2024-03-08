import { type FastifyRequest } from 'fastify'
import type UsersData from '../data/users/users-data'
import type AuthService from '../services/auth-service'
import type PublicUserModel from '../models/public-user-model'

interface GraphqlDiScope {
  request: FastifyRequest
  usersData: UsersData
  authService: AuthService
  user: PublicUserModel | undefined
}

export default GraphqlDiScope
