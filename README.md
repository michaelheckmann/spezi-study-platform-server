# Spezi Study Platform Server

This project is a backend server for the Spezi Study Platform, providing authentication and various endpoints (e.g. team and study management).

## Features

-   **Authentication**: Secure user authentication and session management.
-   **Database**: Uses Drizzle ORM for type-safe database access.
-   **API**: RESTful endpoints for all major resources.
-   **Cloudflare Workers**: Deployable as a serverless function.
-   **Utilities**: Middleware for error handling, authentication, and more.

## Project Structure

```
.
├── drizzle/                  # Database migrations and metadata
├── src/
│   ├── auth/                 # Authentication logic
│   ├── auth-database/        # Auth-related database schemas
│   ├── database/             # Database entities and access
│   ├── routes/               # API route handlers
│   └── utils/                # Utility functions and middleware
├── worker-configuration.d.ts # Worker types
├── drizzle.config.ts         # Drizzle ORM configuration
├── wrangler.toml             # Cloudflare Workers configuration
├── package.json              # Project metadata and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v22+)
-   [Bun](https://bun.sh/)
-   [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/) (for deployment)
-   [Drizzle Kit](https://orm.drizzle.team/docs/overview) (for migrations)

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/michaelheckmann/spezi-study-platform-server.git
    cd spezi-study-platform-server
    ```

2. **Install dependencies:**

    ```sh
    bun install
    ```

3. **Start the development server locally**:

```sh
bun run dev
```

## API Overview

-   **Authentication**: `/auth/*`
-   **Teams**: `/teams/*`
-   **Studies**: `/studies/*`

See the [src/routes](src/routes) directory for detailed route handlers.

## Configuration

-   **`wrangler.toml`**: Cloudflare Worker settings.
-   **`drizzle.config.ts`**: Database connection and migration settings.
-   **`tsconfig.json`**: TypeScript compiler options.

## Scripts

Common scripts in [package.json](package.json):

-   `bun run auth:update`: Generate Better Auth schema
-   `bun run db:generate`: Create Drizzle migrations
-   `bun run db:migrate:dev`: Apply migrations locally (D1)
-   `bun run db:migrate:prod`: Apply migrations to remote (D1)
-   `bun run db:studio:dev`: Open Drizzle Studio (local)
-   `bun run db:studio:prod`: Open Drizzle Studio (remote)
-   `bun run deploy`: Deploy to Cloudflare Workers
