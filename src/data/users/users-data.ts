import type PublicUserModel from "../../models/public-user-model";
import type UserModel from "../../models/user-model";
import type AuthService from "../../services/auth-service";
import type DatabaseConnectionPool from "../../singletons/database-connection-pool";
import type GraphqlDiScope from "../../types/graphql-di-scope";

class UsersData {
  private readonly databaseConnectionPool: DatabaseConnectionPool;
  private readonly authService: AuthService;

  constructor({ databaseConnectionPool, authService }: GraphqlDiScope) {
    this.databaseConnectionPool = databaseConnectionPool;
    this.authService = authService;
  }

  public async addUser(user: Omit<UserModel, "id">): Promise<number> {
    const encryptedPassword = await this.authService.encryptPassword(
      user.password
    );
    const db = this.databaseConnectionPool.get();
    const [id] = await db("users").insert({
      username: user.username,
      password: encryptedPassword,
      created_at: new Date(),
    });
    return id;
  }

  public async findById(id: number): Promise<PublicUserModel | null> {
    const db = this.databaseConnectionPool.get();
    const user = await db("users").select("username").where("id", id).first();
    if (user == null) {
      return null;
    }
    return { id, username: user.username };
  }

  public async findByIdIn(ids: readonly number[]): Promise<PublicUserModel[]> {
    const db = this.databaseConnectionPool.get();
    const users = await db("users").select("id", "username").whereIn("id", ids);
    return users.map(({ id, username }) => ({ id, username }));
  }

  public async findByUsername(
    username: string
  ): Promise<PublicUserModel | null> {
    const db = this.databaseConnectionPool.get();
    const user = await db("users")
      .select("id")
      .where("username", username)
      .first();
    if (user == null) {
      return null;
    }
    return { id: user.id, username };
  }

  public async findByUsernameIn(
    usernames: readonly string[]
  ): Promise<PublicUserModel[]> {
    const db = this.databaseConnectionPool.get();
    const users = await db("users")
      .select("id", "username")
      .whereIn("username", usernames);
    return users.map(({ id, username }) => ({ id, username }));
  }

  public async existsUsername(username: string): Promise<boolean> {
    const db = this.databaseConnectionPool.get();
    const user = await db("users")
      .select("id")
      .where("username", username)
      .first();
    return user != null;
  }

  public async checkPassword(id: number, password: string): Promise<boolean> {
    const db = this.databaseConnectionPool.get();
    const user = await db("users").select("password").where("id", id).first();
    if (user == null) {
      return false;
    }
    return await this.authService.checkPassword(password, user.password);
  }
}

export default UsersData;
