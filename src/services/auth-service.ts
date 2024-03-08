import { sign, verify } from 'jsonwebtoken'
import type UsersData from '../data/users/users-data'
import type GraphqlDiScope from '../types/graphql-di-scope'
import type PublicUserModel from '../models/public-user-model'
import { AUTH_TOKEN_SECRET_KEY, AUTH_TOKEN_TIME_TO_LIVE_IN_MS } from '../constants/auth-token-constantst'

class AuthService {
  private readonly usersData: UsersData

  constructor ({ usersData }: GraphqlDiScope) {
    this.usersData = usersData
  }

  public generateAuthToken (user: PublicUserModel): string {
    return sign({ userId: user.id }, AUTH_TOKEN_SECRET_KEY, { expiresIn: AUTH_TOKEN_TIME_TO_LIVE_IN_MS, subject: user.username })
  }

  public validateAuthToken (authToken: string): number {
    const { userId } = verify(authToken, AUTH_TOKEN_SECRET_KEY)
    return userId
  }
}

export default AuthService
