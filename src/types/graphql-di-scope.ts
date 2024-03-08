import { type FastifyRequest } from 'fastify'
import type UsersData from '../data/users/users-data'
import type AuthService from '../services/auth-service'

interface GraphqlDiScope {
  request: FastifyRequest
  usersData: UsersData
  authService: AuthService
}

export default GraphqlDiScope
