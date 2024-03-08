import path from 'path'
import { type MercuriusOptions } from 'mercurius'
import { type FastifyPluginOptions } from 'fastify'
import { type DocumentNode } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { type IResolvers } from '@graphql-tools/utils'
import type GraphqlContext from '../types/graphql-context'

const typesArray = loadFilesSync<DocumentNode>(path.join(__dirname, '../schema/**/*.graphql'))
const resolversArray = loadFilesSync<IResolvers>(path.join(__dirname, '../resolvers/**/*.ts'))

const context: MercuriusOptions['context'] = (request): GraphqlContext => {
  return {
    diScope: (request.diScope.cradle as GraphqlContext['diScope'])
  }
}

function configMercurius (): MercuriusOptions & FastifyPluginOptions {
  return {
    path: '/graphql',
    schema: makeExecutableSchema({
      typeDefs: mergeTypeDefs(typesArray),
      resolvers: mergeResolvers(resolversArray)
    }),
    context
  }
}

export default configMercurius
