import { type User } from "../gen/generated-schema-types";
import { idToGraphql, GraphqlEntityType } from "../gql-utils/graphql-id";
import type UserModel from "./user-model";

type PublicUserModel = Omit<UserModel, "password">;

export function userToGraphql(
  user: PublicUserModel | null | undefined
): User | null {
  if (user == null) {
    return null;
  }
  return {
    id: idToGraphql(user.id, GraphqlEntityType.USER),
    username: user.username,
  };
}

export default PublicUserModel;
