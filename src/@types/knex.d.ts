import { type Knex } from "knex";

declare module "knex/types/tables" {
  interface User {
    id: number;
    username: string;
    password: string;
    created_at: Date;
    updated_at: Date | null;
  }
  type UserInsert = Pick<User, "username" | "password" | "created_at">;
  type UserUpdate = Partial<Omit<User, "id" | "updated_at">> &
    Pick<User, "updated_at">;

  interface Tables {
    users: Knex.CompositeTableType<User, UserInsert, UserUpdate>;
  }
}
