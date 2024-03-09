import { sign, verify } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type PublicUserModel from '../models/public-user-model'
import { AUTH_TOKEN_SECRET_KEY, AUTH_TOKEN_TIME_TO_LIVE_IN_MS } from '../constants/auth-token-constants'

const BCRYPT_SALT_ROUNDS = 10
/**
 * https://www.npmjs.com/package/bcrypt#hash-info
 */
const BCRYPT_MAGIC_PREFIX = `$2b$${BCRYPT_SALT_ROUNDS}$`

class AuthService {
  public async encryptPassword (password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10)
    return hash.slice(BCRYPT_MAGIC_PREFIX.length)
  }

  public async checkPassword (password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, `${BCRYPT_MAGIC_PREFIX}${hash}`)
    return result
  }

  public generateAuthToken (user: PublicUserModel): string {
    return sign({ userId: user.id }, AUTH_TOKEN_SECRET_KEY, { expiresIn: AUTH_TOKEN_TIME_TO_LIVE_IN_MS, subject: user.username })
  }

  public validateAuthToken (authToken: string): number | undefined {
    const verifyResult = verify(authToken, AUTH_TOKEN_SECRET_KEY)
    if (typeof verifyResult === 'string') {
      return undefined
    }
    const { userId } = verifyResult
    return userId
  }
}

export default AuthService
