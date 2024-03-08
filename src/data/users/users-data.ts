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
      username: user.username
    })
    return id
  }

  public findById (id: number): UserModel | undefined {
    return this.users.find((user) => user.id === id)
  }
}

export default UsersData
