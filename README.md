# Twello

A single-tenant kanban app built with Next.js, shadcn/ui, Better Auth, and PostgreSQL. Tasks are sticky notes you can move between lists.

Create private boards, share editor or viewer links, invite teammates by email, assign tasks, and customize your profile. Board changes sync every three seconds. Conflicting task edits preserve your draft instead of silently overwriting another person's work.

## Run locally

Use Node.js 22 or newer and Docker.

```sh
npm install
npm run setup
npm run dev
```

Open [localhost:3100](http://localhost:3100). Create an account and open [the local email inbox](http://localhost:8025) to verify your address. `npm run setup` creates a gitignored `.env.local` with random secrets, starts Postgres and Mailpit, and applies migrations. Existing environment files are preserved.

Mailpit captures development mail. It does not deliver to external inboxes. For real email delivery, configure the SMTP values in `.env.example` with your provider's verified sender.

## Check collaboration

With the development app and services running:

```sh
npm run verify:smoke
npm run build
```

The smoke script uses actual authenticated HTTP requests, PostgreSQL, and Mailpit. It creates temporary accounts and boards, tests permissions, invitations, assignments, concurrent edits, profiles, and logout, then removes its temporary boards. It runs only against localhost.

## Run a Zenith preview

```sh
npm i -g @zenith-hosting/cli
zenith auth login
node scripts/prepare-preview.mjs
```

The preparation script prints a temporary project path. It copies the current app and creates a separate preview environment so your local database and secrets remain local.

```sh
zenith check --project /path/printed/by/the/script --upload-size
zenith up --project /path/printed/by/the/script
```

The root `zenith-compose.yml` is for an isolated preview with Postgres and captured email. Its login page links to a shared test inbox for verification and invitations. That inbox is enabled only by the temporary preview environment. `zenith-publish.yml` contains generated database/auth secrets and Zenith's real SMTP mappings for a published installation. Replace `zenith-compose.yml` with that file when preparing a public submission, then follow `.agents/skills/zenith-publish/SKILL.md`.

## Deploy with real email

Set a public `BETTER_AUTH_URL`, a random `BETTER_AUTH_SECRET`, Postgres credentials, and SMTP settings. Use `.env.example` as the variable reference. The runtime applies checked-in migrations before starting Next.js. The Docker image runs as the unprivileged `node` user.

Users must verify their email before signing in. Email invitations require the verified account to match the recipient. Owners manage sharing and members. Editors change lists and tasks. Viewers can read. Links expire after seven days and can be revoked. Revoking a link stops new joins; remove an existing member to revoke their board access.
