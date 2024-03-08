# GQL-Prime

Main objective of this project is to create a foundation for GraphQL backend that has all required features for a production API and it is supposed to be
easy to maintain. Includes:

- Database access (Knex) -- TODO
- External cache read and write (Redis) -- TODO
- Dependency injection (Awilix)
- GraphQL schema / resolvers (Mercurius)
- Data loaders to avoid N+1 issues -- TODO
- HTTP server (Fastify)
- Unit and integration tests -- TODO

It's still a work in progress.

## Dependency Injection (Awilix)

Classes from `./src/data` and `./src/services` are automatically made available in the Awilix container.
Their default lifetime is singleton, meaning there's only one instance for the entire app.
They are exposed according to the file name (e.g. `user-service.ts` becomes `userService` in the container).

Functions from `./src/di-resolvers` are automatically made available as well, but their lifetime is scoped to
a request.
They are exposed according to the file name, with `di-resolver` removed from the suffix
(e.g. `current-date-di-resolver.ts` becomes `currentDate` in the container).

The Awilix proxy object is not typed. To work around that, check type declaration at `./src/types/graphql-di-scope.ts`.
The container is exposed to GQL resolvers through `context.diScope`.

Check `./src/config/config-awilix.ts` to see how it's setup.

## GraphQL schema / resolvers (Mercurius)

GraphQL schema is exposed through Mercurius. All files in `./src/gql-schema` are merged to form the final exposed schema.

All files defined in `./src/gql-resolver` are merged and automatically added as resolvers to the GraphQL runtime.
The exported objects are merged, so each gql-resolver file should export an object that declares a type in the exposed schema.

For example, each query resolver needs to export `{ Query: ... }`. In the same way each mutation resolver needs to export `{ Mutation: ... }`.
Type resolvers need export their type, e.g. `{ CustomType: ... }`.

Multiple files can export the same type, the resolvers are combined/merged.

Check `./src/config/config-mercurius.ts` to see how it's setup.
