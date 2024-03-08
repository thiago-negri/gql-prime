import { sign } from 'jsonwebtoken'
import type UsersData from '../data/users/users-data'
import type GraphqlDiScope from '../types/graphql-di-scope'
import type PublicUserModel from '../models/public-user-model'
import { AUTH_TOKEN_TIME_TO_LIVE_IN_MS } from '../constants/auth-token-constantst'

const SECRET_KEY = 'secret-key' // TODO(tnegri): Secrets manager

class AuthService {
  private readonly usersData: UsersData

  constructor ({ usersData }: GraphqlDiScope) {
    this.usersData = usersData
  }

  public generateAuthToken (user: PublicUserModel): string {
    return sign({ userId: user.id }, SECRET_KEY, { expiresIn: AUTH_TOKEN_TIME_TO_LIVE_IN_MS, subject: user.username })
  }
}

export default AuthService
