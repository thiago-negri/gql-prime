import cacheKeys from "../../cache/cache-keys";
import { type QueryResolvers } from "../../gen/generated-schema-types";
import { userToGraphql } from "../../models/public-user-model";
import type GraphqlContext from "../../types/graphql-context";

const findUserQueryResolver: QueryResolvers<GraphqlContext>["findUser"] =
  async (_parent, { username }, context) => {
    const { cacheService } = context.diScope;
    const user = await cacheService.read(cacheKeys.users.public.byUsername, {
      username,
    });
    return userToGraphql(user);
  };

const Query: QueryResolvers<GraphqlContext> = {
  findUser: findUserQueryResolver,
};
export default { Query };
