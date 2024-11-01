import { GraphqlEntityType, idFromGraphl } from "gql-resolvers/graphql-id";
import cacheKeys from "../../cache/cache-keys";
import { type QueryResolvers } from "../../gen/generated-schema-types";
import type GraphqlContext from "../../types/graphql-context";
import { userToGraphql } from "models/public-user-model";

const userQueryResolver: QueryResolvers<GraphqlContext>["user"] = async (
  _parent,
  { id },
  context
) => {
  const { cacheService } = context.diScope;
  const userId = idFromGraphl(id, GraphqlEntityType.USER);
  const user = await cacheService.read(cacheKeys.users.public.byId, {
    id: userId,
  });
  return userToGraphql(user);
};

const Query: QueryResolvers<GraphqlContext> = {
  user: userQueryResolver,
};
export default { Query };
