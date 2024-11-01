import path from "path";
import mercurius, { type MercuriusOptions } from "mercurius";
import { type FastifyInstance } from "fastify";
import { type DocumentNode } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { type IResolvers } from "@graphql-tools/utils";
import type GraphqlContext from "../types/graphql-context";
import type GraphqlDiScope from "../types/graphql-di-scope";

const typesArray = loadFilesSync<DocumentNode>(
  path.join(__dirname, "../gql-schema/**/*.graphql")
);
const resolversArray = loadFilesSync<IResolvers>(
  path.join(__dirname, "../gql-resolvers/**/*.ts")
);

const context: MercuriusOptions["context"] = (request): GraphqlContext => {
  return {
    diScope: request.diScope.cradle as GraphqlDiScope,
  };
};

async function configMercurius(app: FastifyInstance): Promise<void> {
  await app.register(mercurius, {
    path: "/graphql",
    schema: makeExecutableSchema({
      typeDefs: mergeTypeDefs(typesArray),
      resolvers: mergeResolvers(resolversArray),
    }),
    context,
  });
}

export default configMercurius;
