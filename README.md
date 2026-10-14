# Twello

A single-tenant kanban app built with Next.js, shadcn/ui, Better Auth, and PostgreSQL. Tasks are sticky notes you can move between lists.

Create private boards, share editor or viewer links, assign tasks, and customize your profile. Board changes sync every three seconds. Conflicting task edits preserve your draft instead of silently overwriting another person's work.

## Run locally

Use Node.js 22 or newer and Docker.

```sh
npm install
npm run setup
npm run dev
```

Open [localhost:3100](http://localhost:3100). Create an account to sign in immediately. `npm run setup` creates a gitignored `.env.local` with random secrets, starts Postgres, and applies migrations. Existing environment files are preserved.

Email verification, password-reset emails, and email invitations are temporarily disabled. Email remains the login identifier. Board sharing uses editor or viewer links.

## Check collaboration

With the development app and services running:

```sh
npm run verify:smoke
npm run build
```

The smoke script uses actual authenticated HTTP requests and PostgreSQL. It creates temporary accounts and boards, tests permissions, invitations, assignments, concurrent edits, profiles, and logout, then removes its temporary boards. It runs only against localhost.

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

The root `zenith-compose.yml` pins a published container image and contains generated database/auth secrets and the public auth URL mapping for published installations. The preparation script uses `zenith-preview.yml` for isolated previews. Follow `.agents/skills/zenith-publish/SKILL.md` for catalogue submission.

## Deploy

Set a public `BETTER_AUTH_URL`, a random `BETTER_AUTH_SECRET`, Postgres credentials. Email delivery is currently disabled. Use `.env.example` as the variable reference. The runtime applies checked-in migrations before starting Next.js. The Docker image runs as the unprivileged `node` user.

Signup signs users in immediately. Email invitations are paused. Owners manage sharing and members. Editors change lists and tasks. Viewers can read. Links expire after seven days and can be revoked. Revoking a link stops new joins; remove an existing member to revoke their board access.

The manually triggered `Publish container` GitHub Actions workflow builds a full source commit into GHCR. After publishing an image, update the Compose image reference to its immutable digest before submitting a new version to Zenith.
