import type PublicUserModel from '../../models/public-user-model'
import type UserModel from '../../models/user-model'
import type AuthService from '../../services/auth-service'
import type DatabaseConnectionPool from '../../services/database-connection-pool'
import type GraphqlDiScope from '../../types/graphql-di-scope'

class UsersData {
  private readonly databaseConnectionPool: DatabaseConnectionPool
  private readonly authService: AuthService

  constructor ({ databaseConnectionPool, authService }: GraphqlDiScope) {
    this.databaseConnectionPool = databaseConnectionPool
    this.authService = authService
  }

  public async addUser (user: Omit<UserModel, 'id'>): Promise<number> {
    const encryptedPassword = await this.authService.encryptPassword(user.password)
    const db = this.databaseConnectionPool.get()
    const [id] = await db('users').insert({
      username: user.username,
      password: encryptedPassword,
      created_at: new Date()
    })
    return id
  }

  public async findById (id: number): Promise<PublicUserModel | undefined> {
    const db = this.databaseConnectionPool.get()
    const user = await db('users').where('id', id).first()
    if (user == null) {
      return undefined
    }
    return {
      id: user.id,
      username: user.username
    }
  }

  public async findByUsername (username: string): Promise<PublicUserModel | undefined> {
    const db = this.databaseConnectionPool.get()
    const user = await db('users').where('username', username).first()
    if (user == null) {
      return undefined
    }
    return { id: user.id, username: user.username }
  }

  public async existsUsername (username: string): Promise<boolean> {
    const db = this.databaseConnectionPool.get()
    const user = await db('users').where('username', username).first()
    return user != null
  }

  public async checkPassword (id: number, password: string): Promise<boolean> {
    const db = this.databaseConnectionPool.get()
    const user = await db('users').where('id', id).first()
    if (user == null) {
      return false
    }
    return await this.authService.checkPassword(password, user.password)
  }
}

export default UsersData
