import { type MutationResolvers } from "../../gen/generated-schema-types";
import type GraphqlContext from "../../types/graphql-context";

const loginMutationResolver: MutationResolvers<GraphqlContext>["login"] =
  async (_parent, { input }, context) => {
    const { usersData, authService } = context.diScope;
    const { username, password } = input;
    const user = await usersData.findByUsername(username);
    if (user == null) {
      return { ok: false };
    }
    const passwordMatch = await usersData.checkPassword(user.id, password);
    const authToken = passwordMatch
      ? authService.generateAuthToken(user)
      : null;
    return { ok: passwordMatch, authToken };
  };

const Mutation: MutationResolvers<GraphqlContext> = {
  login: loginMutationResolver,
};
export default { Mutation };
