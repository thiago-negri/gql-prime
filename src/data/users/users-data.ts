import type PublicUserModel from '../../models/public-user-model'
import type UserModel from '../../models/user-model'

class UsersData {
  private readonly users: UserModel[]

  constructor () {
    this.users = []
  }

  public addUser (user: Omit<UserModel, 'id'>): number {
    const id = this.users.length
    this.users.push({
      id,
      username: user.username,
      password: user.password
    })
    return id
  }

  public findById (id: number): PublicUserModel | undefined {
    const user = this.users.find((user) => user.id === id)
    if (user === undefined) {
      return undefined
    }
    return { id: user.id, username: user.username }
  }

  public findByUsername (username: string): PublicUserModel | undefined {
    const user = this.users.find((user) => user.username === username)
    if (user === undefined) {
      return undefined
    }
    return { id: user.id, username: user.username }
  }

  public existsUsername (username: string): boolean {
    const user = this.users.find((user) => user.username === username)
    return user !== undefined
  }

  public checkPassword (id: number, password: string): boolean {
    const user = this.users.find((user) => user.id === id)
    if (user === undefined) {
      return false
    }
    return user.password === password
  }
}

export default UsersData
