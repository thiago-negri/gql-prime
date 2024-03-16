# GQL-Prime

Main objective of this project is to create a foundation for GraphQL backend that has all required features for a production API and it is supposed to be
easy to maintain. Includes:

- Database access and migrations (Knex)
- Secure properties read from JSON file
- Secure properties are typesafe
- External cache read and write (Redis)
- Allow expire of half-baked keys on cache -- TODO
- In-memory cache with low TTL as a two-layer cache before hitting Redis -- TODO
- Dependency injection (Awilix)
- GraphQL schema / resolvers (Mercurius)
- Data loaders to avoid N+1 issues on database -- TODO
- Data loaders for Redis mget -- TODO
- HTTP server (Fastify)
- Unit and integration tests -- TODO
- Unit test that guarantees cache keys + schema uniqueness -- TODO

It's still a work in progress.

## Secure Properties

You need to create a `.env` file (you can copy from `.env.example`).

The secure properties are going to be loaded from `secure-properties-<ENV_NAME>.json` and injected into the DI container.
Secure properties will **not** be injected into `process.env` because other NPM packages may end up logging or leaking
the env variables.

## Database (Knex)

You can run a local MySQL container using `docker-compose up -d`.

Database migrations live in `./src/migrations` and can be run against your local database with `knex migrate:latest`.
Make sure you have Knex installed globally to be able to use its CLI (`npm i -g knex`).

Table schema is defined in `./src/@types/knex.d.ts`, this helps keep database operations typesafe.

The app's database connection pool is defined by `./src/services/database-connection-pool.ts`, it's made available
through dependency injection.

Data-layer services are defined in `./src/data` and present a higher-level of abstraction when handling database
tables.

You can create a new migration using `knex migrate:make <NAME> -x ts`.

## Dependency Injection (Awilix)

Classes from `./src/data` and `./src/services` are automatically made available in the Awilix container.
Their default lifetime is singleton, meaning there's only one instance for the entire app.
They are exposed according to the file name (e.g. `user-service.ts` becomes `userService` in the container).

Functions from `./src/di-resolvers` are automatically made available as well, but their lifetime is scoped to
a request.
They are exposed according to the file name, with `di-resolver` removed from the suffix
(e.g. `current-date-di-resolver.ts` becomes `currentDate` in the container).

Singletons from `./src/singletons` are manually registered in the DI context in `config-awilix.ts`.
Those are usually dependencies that require some sort of setup before the app starts (e.g. connecting to external servers),
so to avoid having to `await` in the app code (because the connection returns a promise), we do the awaits during
app setup and register the value after the async operation finishes.

The Awilix proxy object is not typed. To work around that, check type declaration at `./src/types/graphql-di-scope.ts`.
The container is exposed to GQL resolvers through `context.diScope`.

Check `./src/config/config-awilix.ts` to see how it's setup.

## GraphQL schema / resolvers (Mercurius)

GraphQL schema is exposed through Mercurius. All files in `./src/gql-schema` are merged to form the final exposed schema.

If you change your schema, run `npm run codegen` to generate a new `./src/gen/generated-schema-types.ts`.

All files defined in `./src/gql-resolver` are merged and automatically added as resolvers to the GraphQL runtime.
The exported objects are merged, so each gql-resolver file should export an object that declares a type in the exposed schema.

For example, each query resolver needs to export `{ Query: ... }`. In the same way each mutation resolver needs to export `{ Mutation: ... }`.
Type resolvers need export their type, e.g. `{ CustomType: ... }`.

Multiple files can export the same type, the resolvers are combined/merged.

Check `./src/config/config-mercurius.ts` to see how it's setup.

## Cache (Redis)

Cache schema is defined by `./src/cache/cache-types.ts`, and cache keys are defined in `./src/cache/cache-keys.ts`.

Cache keys define the TTL and a resolver function that will be called in case the value is not in cache.

The Redis client is declared in `./src/singletons/redis-client.ts`, and is available through DI as `redisClient`, but
app code should use `cacheService` (defined in `./src/services/cache-service.ts`).
