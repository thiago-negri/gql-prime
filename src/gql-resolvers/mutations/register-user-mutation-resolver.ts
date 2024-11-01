import ErrorCodes from "constants/error-codes";
import { type MutationResolvers } from "../../gen/generated-schema-types";
import type GraphqlContext from "../../types/graphql-context";
import GraphqlError from "../../types/graphql-error";
import { GraphqlEntityType, idToGraphql } from "gql-utils/graphql-id";

const registerUserMutationResolver: MutationResolvers<GraphqlContext>["registerUser"] =
  async (_parent, { input }, context) => {
    const { usersData } = context.diScope;
    const { username, password } = input;
    const usernameExists = await usersData.existsUsername(username);
    if (usernameExists) {
      throw new GraphqlError(ErrorCodes.USERNAME_ALREADY_EXISTS);
    }
    const id = await usersData.addUser({ username, password });
    return {
      user: {
        id: idToGraphql(id, GraphqlEntityType.USER),
        username,
      },
    };
  };

const Mutation: MutationResolvers<GraphqlContext> = {
  registerUser: registerUserMutationResolver,
};
export default { Mutation };
