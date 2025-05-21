# Monsoft CRM

_AI-powered CRM._

## About

Monsoft CRM is designed to...

Developed by [Monsoft Solutions](https://www.monsoftsolutions.com).

## Key Features

## Getting Started

### Development Setup

1. Install dependencies: `npm i`
2. Initialize local environment: `npm run env`
3. Prepare database: `npm run data`

> or simply run `npm run init`, which does all of the above

### Running the App

4. Start development server: `npm run dev`
5. Start production server: `npm run start`

## Documentation

## Technical Architecture

-   **End-to-End Type-Safety Tech-Stack**

    -   TypeScript (strictly typed)
    -   Zod (runtime schema validation)
    -   Drizzle ORM (DB operations)
    -   tRPC (API endpoints)
    -   Tanstack Router (client-side routing)
    -   ESLint (Linting)
    -   Prettier (Formatting)

-   **Environment Variables**

    -   env-cmd (on-script)
    -   cross-env (platform-independent)
    -   zod (type-safe)
    -   Required environment variables include:
        -   `MSS_LANGFUSE_SECRET_KEY`: Secret key for LangFuse AI telemetry
        -   `MSS_LANGFUSE_PUBLIC_KEY`: Public key for LangFuse AI telemetry
        -   `MSS_LANGFUSE_BASE_URL`: Base URL for the LangFuse API endpoint

-   **Authentication & Authorization**

    -   Session-based authentication
    -   ABAC authorization

-   **Database (MySQL + Drizzle)**

    -   Runtime (drizzle-orm)
    -   Migrations (drizzle-kit)
    -   Seeding (drizzle-seed)

-   **API (tRPC)**

    -   Query
    -   Mutation
    -   Subscription

-   **Monorepo Architecture**
    -   Module-based
    -   Shared functionality
    -   Consistent conventions
        -   Variable names
        -   Filesystem hierarchy
        -   Filenames + extensions
        -   Dependency flow

```
.
├── api/                     # endpoints
├── auth/                    # authentication
├── config/                  # configuration
├── css/                     # styling
├── db/                      # database
├── dist/                    # deployment
├── drizzle/                 # database migrations
├── docs/                    # documentation (VitePress)
├── env/                     # environment variables
├── errors/                  # error-handling
├── events/                  # event-handling
├── guard/                   # authorization
├── log/                     # logging
├── package/                 # client package
├── routes/                  # client-side routes
├── seed/                    # database seeding
├── shared/                  # shared functionality
├── app/                     # main application code
│   ├── server/              # express backend
│   └── web/                 # react+vite frontend
└── mods/                     # core business logic
    ├── template/            # template feature
    │   ├── types/           # typescript types
    │   ├── schemas/         # zod schemas
    │   ├── enums/           # zod enums
    │   ├── hub/             # event listeners
    │   ├── constants/       # constants
    │   ├── utils/           # pure functions
    │   ├── providers/       # impure functions
    │   ├── res/             # resources
    │   ├── components/      # react components
    │   ├── hooks/           # react hooks
    │   ├── views/           # route views
    │   └── ...              # other kinds of functionality
    └── ...                  # other feature modules
```

## Scripts

The project includes handy scripts for database-handling, development, and deployment:

-   **Database**

    ```bash
    npm run drop        # drop database
    npm run create      # create database
    npm run generate    # generate migrations
    npm run migrate     # apply migrations
    npm run seed        # seed database
    npm run data        # initialize database (all of the above)
    ```

-   **Development** (watch mode + HMR)

    ```bash
    npm run dev          # start development server
    ```

-   **Deployment**

    ```bash
    npm run app:deploy   # build for production
    npm run app:start    # start production server
    ```

## Contributing

Please read our contribution guidelines before submitting PRs.
