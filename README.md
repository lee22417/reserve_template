## Description

- Reservation App REST API

## Env

- Nest, Docker, MySQL, Typescript
- TypeORM, JWT
- MacOS (M1)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

```bash
# Run docker - app, MySQL, Redis
$ docker-compose -f docker-compose.yaml up -d

# Stop docker
$ docker-compose -f docker-compose.yaml down

# Show docker containers
$ docker ps

# Show docker container information
$ docker inspect {container id}
```

## MySQL Container

```bash
# Login MySQL
$ mysql -u {username} -p

# Login as Root
$ mysql -u root -p

# Select DB
> use {database}

# Allow
> FLUSH PRIVILEGES
```

## Reference

- JWT
  https://docs.nestjs.com/security/authentication#implementing-passport-jwt
