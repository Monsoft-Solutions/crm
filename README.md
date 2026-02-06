# Monsoft CRM

**By [Monsoft Solutions](https://monsoftsolutions.com)**

AI-first communication CRM platform for ABA therapy note generation. Manage contacts, automate messaging across SMS, WhatsApp, and email, and generate clinical notes with AI assistance.

## Tech Stack

| Layer     | Technology                               |
| --------- | ---------------------------------------- |
| Frontend  | React 18, TanStack Router, React Query   |
| API       | tRPC 11 on Express                       |
| Database  | Drizzle ORM + PostgreSQL                 |
| Auth      | Better-Auth with Google OAuth            |
| Styling   | Tailwind CSS 4, shadcn/ui (Radix)        |
| AI        | Vercel AI SDK (Anthropic + OpenAI)       |
| Messaging | Twilio (SMS), Meta (WhatsApp), Resend    |
| Build     | Vite, tsup, Turbo                        |

## Prerequisites

- **Node.js** 18+
- **npm** 10.9.2 (specified in root `package.json` `packageManager` field)
- **PostgreSQL** running locally (port 5432)
- **ngrok** account (for local webhook testing)

## Getting Started

```bash
# 1. Clone the repository
git clone git@github.com:Monsoft-Solutions/monsoft-crm.git && cd monsoft-crm

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Copy the example file and fill in real values
cp .env.example monsoft-crm-app/.env-cmdrc

# 4. Set up the database (drops, creates, migrates, seeds)
cd monsoft-crm-app
npm run data

# 5. Start the dev server (server + web + ngrok tunnel)
npm run dev

# 6. Open the app
# http://localhost:81
```

Alternatively, after copying `.env-cmdrc`, run the one-shot setup:

```bash
cd monsoft-crm-app
npm run init    # install + env init + full DB setup
```

## Project Structure

```
crm/
├── monsoft-crm-app/          # Main application
│   ├── bases/                # Infrastructure (api, auth, db, events, etc.)
│   ├── mods/                 # Feature modules (contact, brand, template, etc.)
│   ├── app/                  # Integration layer (re-exports from all mods)
│   ├── routes/               # TanStack Router file-based routes
│   └── shared/               # Shared UI components and hooks
└── packages/                 # Workspace packages (typescript-config, etc.)
```

- **bases/** — Framework-level infrastructure. Establishes patterns and should not be structurally modified.
- **mods/** — Feature/domain modules. Each is self-contained with its own API, DB, components, schemas, and providers.

## Scripts

All commands run from `monsoft-crm-app/`:

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start dev server (server + web + ngrok tunnel)    |
| `npm run build`   | Build for production (server + web)               |
| `npm run start`   | Build then run                                    |
| `npm run check`   | Full check (build + tsc + prettier + eslint + env)|
| `npm run check:ts`| TypeScript type checking only                     |
| `npm run check:fmt`| Prettier formatting check                        |
| `npm run check:lint`| ESLint linting check                            |
| `npm run data`    | Full DB reset (drop + create + migrate + seed)    |
| `npm run generate`| Generate Drizzle migrations                       |
| `npm run migrate` | Run migrations (local)                            |
| `npm run seed`    | Seed database (local)                             |
| `npm run fmt`     | Auto-format with Prettier                         |
| `npm run auth`    | Regenerate Better-Auth tables                     |
| `npm run init`    | One-shot: install + env init + full DB setup      |

## Environment Variables

The app uses `.env-cmdrc` (JSON format, gitignored) for environment configuration. Copy `.env.example` from the project root to `monsoft-crm-app/.env-cmdrc` and fill in real values.

### Two-Tier Configuration

1. **Core variables** — Always read from environment at runtime
2. **Service credentials** — Read from environment **only during initial DB seed** (`npm run seed`), then stored in the `core_conf` database table and read from there at runtime

To update service credentials after initial setup, either re-seed the database or modify the `core_conf` table directly.

### Core Variables (read from environment)

| Variable              | Description                              |
| --------------------- | ---------------------------------------- |
| `MSS_DEPLOYMENT_TYPE` | Deployment type (`local`, `production`, `production-preview`) |
| `MSS_FQDN`           | Fully qualified domain name (ngrok URL for local dev) |
| `MSS_DATABASE_HOST`   | PostgreSQL host                          |
| `MSS_DATABASE_PORT`   | PostgreSQL port                          |
| `MSS_DATABASE_NAME`   | Database name                            |
| `MSS_DATABASE_USER`   | Database user                            |
| `MSS_DATABASE_PASS`   | Database password                        |
| `MSS_AUTH_SECRET`     | Better-Auth session encryption secret    |
| `MSS_GOOGLE_ID`       | Google OAuth client ID                   |
| `MSS_GOOGLE_SECRET`   | Google OAuth client secret               |
| `MSS_APP_FOLDER`      | Application folder name                  |
| `MSS_CLIENT_DEV_TOOLS`| Enable client dev tools (`T`/`F`)       |

### Service Credentials (seeded to DB)

| Variable                   | Service   | Description                    |
| -------------------------- | --------- | ------------------------------ |
| `MSS_TWILIO_SID`           | Twilio    | Account SID                    |
| `MSS_TWILIO_TOKEN`         | Twilio    | Auth token                     |
| `MSS_TWILIO_FROM`          | Twilio    | Default SMS phone number       |
| `MSS_WHATSAPP_TOKEN`       | WhatsApp  | Meta API token                 |
| `MSS_WHATSAPP_FROM_PHONE_ID`| WhatsApp | Phone number ID               |
| `MSS_RESEND_API_KEY`       | Resend    | API key                        |
| `ANTHROPIC_API_KEY`        | Anthropic | Claude API key                 |
| `OPENAI_API_KEY`           | OpenAI    | GPT API key                    |
| `LANGFUSE_BASE_URL`        | Langfuse  | Base URL                       |
| `LANGFUSE_PUBLIC_KEY`      | Langfuse  | Public key                     |
| `LANGFUSE_SECRET_KEY`      | Langfuse  | Secret key                     |

## Third-Party Services

| Service    | Purpose                      | Sign-up                          |
| ---------- | ---------------------------- | -------------------------------- |
| PostgreSQL | Database                     | Local install                    |
| ngrok      | Dev tunneling for webhooks   | [ngrok.com](https://ngrok.com)   |
| Google Cloud | OAuth authentication       | [console.cloud.google.com](https://console.cloud.google.com) |
| Twilio     | SMS messaging                | [twilio.com](https://www.twilio.com) |
| Meta Business | WhatsApp messaging        | [developers.facebook.com](https://developers.facebook.com) |
| Resend     | Transactional email          | [resend.com](https://resend.com) |
| Anthropic  | AI (Claude)                  | [console.anthropic.com](https://console.anthropic.com) |
| OpenAI     | AI (GPT)                     | [platform.openai.com](https://platform.openai.com) |
| Langfuse   | AI observability             | [cloud.langfuse.com](https://cloud.langfuse.com) |
