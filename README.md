# Adossi Fred William, Portfolio and Admin CMS

Portfolio for **Adossi Fred William**, Software Engineer and Machine Learning Engineer, rebuilt as a
database-driven Next.js application with a private admin dashboard.

Every piece of text, every project, and every image or video on the public site is editable from
`/admin` without touching code.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | Ported CSS for the public site, Tailwind for the admin |
| Database | PostgreSQL on Neon |
| ORM | Prisma 6 |
| Auth | NextAuth v5, Credentials provider, single admin user |
| Media | Vercel Blob |
| Validation | Zod on every route, action and form |
| Rich text | Markdown, sanitised with rehype-sanitize |
| Hosting | Vercel |

## Why the public site is not built with Tailwind

The original design leans on `color-mix()`, layered `mask-image` gradients, `clamp()` sizing and a
`[data-theme]` cascade. Rewriting that as utility classes is where a visual regression would creep
in unnoticed, so the stylesheet is ported verbatim into `src/app/(public)/globals.css` and the design
tokens are also mapped into `tailwind.config.ts` for anything built with Tailwind.

Tailwind is loaded only from `src/app/admin/admin.css`. That matters: Tailwind's preflight resets
heading sizes and removes list bullets, which would quietly break the public design if it were
global.

## Project layout

```
prisma/
  schema.prisma            15 models, 3 enums
  migrations/              generated with `prisma migrate diff`
  seed/
    index.ts               the only file here: loads src/content into the database
src/
  config/
    site.ts                shared constants, one definition of the featured cap
  content/                 canonical default content, owned by the app
    projects.ts            26 projects
    copy.ts                47 copy blocks
    cv.ts                  experience, education, certifications
    skills.ts              skill tiers, capabilities, domains
    settings.ts            settings, hero figures, coursework, bulleted cards
  app/
    (public)/              homepage, /projects, /projects/[slug], globals.css
    admin/
      login/               sign in, outside the dashboard shell
      (dashboard)/         every authenticated screen, plus its server actions
    api/
      admin/               REST routes for projects, featured toggle, uploads
      auth/                NextAuth handler
    preview/card/          renders the real card component for the admin iframe
  components/
    public/                Nav, Hero, ProjectCard, ProjectMedia, sections
    admin/                 FeaturedSelector, ProjectForm, MediaUploader, editors
  lib/
    db.ts                  Prisma singleton
    auth.ts                NextAuth with the Credentials provider
    auth.config.ts         edge-safe half, imported by middleware
    guard.ts               requireAdmin and the API error shape
    rate-limit.ts          login throttling, backed by Postgres
    queries/               data access, one file per concern
    validation/            Zod schemas, one file per entity
middleware.ts              guards /admin and /api/admin
```

Route handlers authorise, validate with a Zod schema, call a function in `lib/queries`, then
revalidate. No Prisma calls live inside components.

The dependency direction is deliberate: the seed script imports from `src/content`, never the other
way round. Default content belongs to the application, and the seed is just a script that loads it,
so runtime code never reaches into database tooling.

`ProjectCard.tsx` is written once and used by the homepage, `/projects`, and the admin live preview,
so the preview can never drift from the real card.

## Local setup

Requires Node 20 or newer.

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

1. **`DATABASE_URL`** from [neon.tech](https://neon.tech). Create a project in **AWS eu-central-1
   (Frankfurt)** so it sits beside the Vercel region configured in `vercel.json`. Copy the
   **Pooled connection** string, the one whose host contains `-pooler`. The direct endpoint opens a
   new connection per serverless invocation and will exhaust the connection limit under load.
2. **`AUTH_SECRET`** with `openssl rand -base64 32`.
3. **`ADMIN_EMAIL`** and **`ADMIN_PASSWORD`** for the admin user the seed creates. The password must
   be at least 10 characters. Never commit real values.
4. **`BLOB_READ_WRITE_TOKEN`** once blob storage is connected, see below. Uploads are disabled
   without it, and the admin says so rather than failing silently.

Then:

```bash
npx prisma migrate deploy   # apply the schema
npm run db:seed             # load all content and create the admin user
npm run dev                 # http://localhost:3000
```

The public site is at `/` and the dashboard at `/admin`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` then `next build` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Create a migration from schema changes |
| `npm run db:deploy` | Apply pending migrations, used on Vercel |
| `npm run db:seed` | Seed content and upsert the admin user |
| `npm run db:studio` | Browse the database |
| `npm run db:reset` | Drop, re-migrate and re-seed. Destroys all data |

## Re-running the seed

The seed is safe to re-run, but not every model behaves the same way.

- **Projects and copy blocks** are upserted by `slug` and `key`. For copy blocks only the label,
  type, grouping and stored original are refreshed, so text you have edited in the admin is not
  overwritten.
- **Experience, education, certifications, skills and the card lists** are replaced wholesale. Edits
  made to those through the admin will be lost on a re-seed.
- **Site settings** are created once and never overwritten.
- **The admin user** is upserted, so re-running after changing `ADMIN_PASSWORD` resets the password.

## Creating or changing the admin user

The seed reads `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_NAME` from the environment. There is no
hardcoded password anywhere.

```bash
# change the values in .env, then
npm run db:seed
```

Day to day, use **Admin, Account** to change the password. It requires the current password and
hashes the new one with bcrypt at cost 12.

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, choose **Add New Project** and import it. The framework is detected automatically.
3. Add environment variables under **Settings, Environment Variables**, for Production and Preview:
   `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`,
   `NEXT_PUBLIC_SITE_URL` and `BLOB_READ_WRITE_TOKEN`.
4. Deploy. `vercel.json` sets the build command to
   `prisma generate && prisma migrate deploy && next build`, so migrations are applied automatically
   on every deploy.
5. Seed the production database once from your machine, with the production `DATABASE_URL`,
   `ADMIN_EMAIL` and `ADMIN_PASSWORD` set:

   ```bash
   npm run db:seed
   ```

`regions` is set to `fra1` in `vercel.json`, the closest Vercel region to Kigali. Keep the database
in the matching Neon region, otherwise every query pays a cross-continent round trip.

### If a build fails to reach the database

A Neon instance that has scaled to zero can refuse the first burst of connections during a build,
because the build prerenders 26 project pages in parallel. Redeploying works. Using the pooled
connection string makes it far less likely.

## Connecting blob storage

1. In the Vercel dashboard, open the project, then **Storage**, then **Create**, then **Blob**.
2. Connect the store to the project. Vercel adds `BLOB_READ_WRITE_TOKEN` to the environment.
3. For local development run `vercel env pull .env.local`, or copy the token into `.env`.

Limits enforced on the server, in `src/app/api/admin/upload/route.ts`:

| Kind | Types | Maximum |
|---|---|---|
| Image | JPG, PNG, WebP | 10 MB |
| Video | MP4, WebM | 100 MB |
| PDF | PDF | 15 MB |

The browser is checked as well, but the server check is the one that counts. Removing media from a
project deletes the stored blob too, so unused files do not accumulate.

## Custom domain

1. In Vercel, open **Settings, Domains** and add your domain.
2. At your registrar, add the records Vercel shows. For an apex domain that is an `A` record to
   `76.76.21.21`; for `www` it is a `CNAME` to `cname.vercel-dns.com`.
3. Wait for the certificate to be issued, usually a few minutes.
4. Update `NEXT_PUBLIC_SITE_URL` to the new origin and redeploy, so canonical URLs, OpenGraph tags
   and `sitemap.xml` all point at the right host.

This repository previously published to GitHub Pages. A Next.js application cannot be served from
Pages, so once you move to Vercel, point the domain at Vercel and treat the Pages deployment as
retired.

## The admin dashboard

| Route | What it does |
|---|---|
| `/admin` | Counts, a featured indicator, recently edited projects |
| `/admin/projects` | Featured selector, drag to reorder, search, filters, bulk actions |
| `/admin/projects/new` | Create, with live card preview |
| `/admin/projects/[id]` | Edit or delete |
| `/admin/content` | All 47 copy blocks, grouped, with per-field reset |
| `/admin/experience` | Roles and bullets, drag to reorder |
| `/admin/education` | Qualifications, grades, certifications |
| `/admin/skills` | Tiers, levels and skill lists |
| `/admin/capabilities` | What I do, domains, hero figures, coursework, bulleted cards |
| `/admin/settings` | Identity, contact, availability, hero photo, résumé, SEO |
| `/admin/account` | Change password |

The featured limit of six is enforced in the database layer, not only in the UI. Toggling a seventh
returns HTTP 409 whether the request comes from the dashboard or from `curl`.

Every mutation calls `revalidatePath` for `/`, `/projects` and the affected project page, so the
public site reflects a change immediately rather than after a redeploy. Public pages also carry a
one hour `revalidate` as a safety net.

## Security

- Passwords hashed with bcrypt at cost 12.
- Session cookies are `httpOnly`, `sameSite=lax`, and `secure` in production.
- Login is limited to 5 failed attempts per IP per 15 minutes. The counter lives in Postgres,
  because serverless instances do not share memory, and it is enforced inside the credentials
  provider rather than in the form, so posting directly to `/api/auth/callback/credentials` is
  covered too.
- `middleware.ts` guards `/admin` and `/api/admin`. Every mutating route and action independently
  calls `requireAdmin()`, because middleware alone is not a security boundary.
- Markdown is sanitised with `rehype-sanitize` before rendering.
- `DATABASE_URL`, `AUTH_SECRET` and `BLOB_READ_WRITE_TOKEN` are read only on the server and never
  reach the client bundle.
- `/admin`, `/api` and `/preview` are excluded in `robots.ts`, and `/admin` also sends
  `X-Robots-Tag: noindex`.

## Known limitations

- `next-auth` is pinned to a `5.0.0-beta` release. It is what the App Router ecosystem has settled
  on, but it is still a beta.
- `npm audit` reports advisories inside Next.js's own dependency tree, in `sharp`, `postcss` and
  `undici`, plus the ESLint chain which is development only. They cannot be resolved at the
  application level on Next 15.
- Uploads require a real `BLOB_READ_WRITE_TOKEN`. Until one is set the admin shows a banner and the
  upload route returns 503 with an explanation, rather than appearing to work.

Adossi Fred William, Kigali, Rwanda
