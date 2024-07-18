## Description

E-COMMERCE API CREATED USING NESTJS

## Installation

```bash
$ pnpm install
```

#### .env file

```bash
# postgresql
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

# pgAdmin
PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=
PGADMIN_LISTEN_PORT=

# database url
DATABASE_URL=

```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Database

```bash
# generate prisma client
$ npx prisma generate

# migrate database
$ migrate:dev
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Stay in touch

- Author - [AndrewJs](https://www.linkedin.com/in/andres-arevalo-87404820a/)
