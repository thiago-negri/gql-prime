import { type User } from "gen/generated-schema-types";
import type UserModel from "./user-model";
import { GraphqlEntityType, idToGraphql } from "gql-resolvers/graphql-id";

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
