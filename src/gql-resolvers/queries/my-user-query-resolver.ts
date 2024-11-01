import { userToGraphql } from "models/public-user-model";
import { type QueryResolvers } from "../../gen/generated-schema-types";
import type GraphqlContext from "../../types/graphql-context";

const myUserQueryResolver: QueryResolvers<GraphqlContext>["myUser"] = async (
  _parent,
  _args,
  context
) => {
  const { userPromise } = context.diScope;
  const user = await userPromise;
  return userToGraphql(user);
};

const Query: QueryResolvers<GraphqlContext> = { myUser: myUserQueryResolver };
export default { Query };
