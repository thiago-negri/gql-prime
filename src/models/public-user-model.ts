import type UserModel from './user-model'

type PublicUserModel = Omit<UserModel, 'password'>

export default PublicUserModel
