import DataLoader from "dataloader";
import type PublicUserModel from "../../models/public-user-model";
import type GraphqlDiScope from "../../types/graphql-di-scope";
import type UsersData from "../../data/users/users-data";
import utilsGroupByUnique from "../../utils/utils-group-by-unique";

class UsersDataLoader {
  private readonly usersData: UsersData;
  private readonly loaderById: DataLoader<number, PublicUserModel | null>;
  private readonly loaderByUsername: DataLoader<string, PublicUserModel | null>;

  constructor({ usersData }: GraphqlDiScope) {
    this.usersData = usersData;
    this.loaderById = new DataLoader(this.loadById.bind(this), {
      maxBatchSize: 20,
    });
    this.loaderByUsername = new DataLoader(this.loadByUsername.bind(this), {
      maxBatchSize: 20,
    });
  }

  async findById(id: number): Promise<PublicUserModel | null> {
    return await this.loaderById.load(id);
  }

  async findByUsername(username: string): Promise<PublicUserModel | null> {
    return await this.loaderByUsername.load(username);
  }

  private async loadById(
    ids: readonly number[]
  ): Promise<Array<PublicUserModel | null>> {
    if (ids.length === 1) {
      return [await this.usersData.findById(ids[0])];
    }
    const users = await this.usersData.findByIdIn(ids);
    const userById = utilsGroupByUnique(users, (user) => user.id);
    return ids.map((id) => userById.get(id) ?? null);
  }

  private async loadByUsername(
    usernames: readonly string[]
  ): Promise<Array<PublicUserModel | null>> {
    if (usernames.length === 1) {
      return [await this.usersData.findByUsername(usernames[0])];
    }
    const users = await this.usersData.findByUsernameIn(usernames);
    const userByUsername = utilsGroupByUnique(users, (user) => user.username);
    return usernames.map((username) => userByUsername.get(username) ?? null);
  }
}

export default UsersDataLoader;
