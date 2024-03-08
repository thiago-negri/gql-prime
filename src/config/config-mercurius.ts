import path from 'path'
import { type MercuriusSchemaOptions } from 'mercurius'
import { type FastifyPluginOptions } from 'fastify'
import { type DocumentNode } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { type IResolvers } from '@graphql-tools/utils'

const typesArray = loadFilesSync<DocumentNode>(path.join(__dirname, '../schema/**/*.graphql'))
const resolversArray = loadFilesSync<IResolvers>(path.join(__dirname, '../resolvers/**/*.ts'))

function configMercurius (): MercuriusSchemaOptions & FastifyPluginOptions {
  return {
    path: '/graphql',
    schema: makeExecutableSchema({
      typeDefs: mergeTypeDefs(typesArray),
      resolvers: mergeResolvers(resolversArray)
    })
  }
}

export default configMercurius
