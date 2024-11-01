# myUser

```sh
curl 'http://localhost:3000/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'x-auth-token: ...' \
  --data-binary '{"query":"{ myUser { id username } }","variables":{}}' \
  --compressed
```

# findUser

```sh
curl 'http://localhost:3000/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  --data-binary '{"query":"{ findUser(username: \"tnegri\") { id username } }","variables":{}}' \
  --compressed
```

# user

```sh
curl 'http://localhost:3000/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  --data-binary '{"query":"{ user(id: \"user:1\") { id username } }","variables":{}}' \
  --compressed
```

# register

```sh
curl 'http://localhost:3000/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  --data-binary '{"query":"mutation { registerUser(input: { username: \"tnegri\" password: \"passw0rd\" }) { user { id username } } }","variables":{}}' \
  --compressed
```

# login

```sh
curl 'http://localhost:3000/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  --data-binary '{"query":"mutation { login(input: { username: \"tnegri\" password: \"passw0rd\" }) { ok authToken } }","variables":{}}' \
  --compressed
```
