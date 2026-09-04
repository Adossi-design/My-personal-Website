# Adossi Fred William, Portfolio and Admin CMS

This is my personal digital home, rebuilt from a single static HTML page into a database-driven
Next.js application with a private admin dashboard behind it.

**Live at [my-personal-website-eta-seven.vercel.app](https://my-personal-website-eta-seven.vercel.app)**

I am a Software Engineering student at African Leadership University in Kigali, Rwanda, originally
from N'Djamena, Chad, and an aspiring AI Research Engineer. The site brings together my background,
education, experience, projects, skills, interests, community work, entrepreneurship, research goals,
and long-term vision.

## Why I rebuilt it

The original version was a single `index.html` file. It looked the way I wanted, but every time I
finished a project or changed a sentence I had to edit code and redeploy, and my project list lived
inside a JavaScript array. That is fine for a page that never changes, and mine changes constantly.

So I moved editable copy, projects and media into a database, and built an admin dashboard to manage
them. I can now add a project or reword a paragraph from my phone, and the public site updates
immediately while source-controlled defaults keep deployments reproducible.

The current public experience uses a section-aware visual atmosphere, progressive scroll reveals,
interactive case-study cards and reduced-motion fallbacks. The movement is designed to clarify the
journey rather than compete with it.

## What I used

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | My original CSS for the public site, Tailwind for the admin |
| Database | PostgreSQL on Neon |
| ORM | Prisma 6 |
| Auth | NextAuth v5, credentials provider, a single admin account |
| Media | Vercel Blob with client uploads |
| Validation | Zod on every route, action and form |
| Rich text | Markdown, sanitised with rehype-sanitize |
| Hosting | Vercel |

## Two decisions worth explaining

**I did not rebuild the public site in Tailwind.** My design leans on `color-mix()`, layered
`mask-image` gradients, `clamp()` sizing and a `[data-theme]` cascade for the light and dark themes.
The public animation and atmosphere system therefore lives in `src/app/(public)/globals.css`, while
the same design tokens are mapped into `tailwind.config.ts` for anything built with Tailwind.

Tailwind therefore loads only from `src/app/admin/admin.css`. That matters more than it sounds:
Tailwind's preflight resets heading sizes and strips list bullets, and if it were global it would
quietly break my public design.

**Uploads go straight from the browser to storage.** Vercel serverless functions cap request bodies
at 4.5 MB. If files travelled through my API route, a normal phone photo would fail and a project
demo video would be impossible. Instead the browser asks my API for a short-lived signed token and
sends the file directly to blob storage. The route still authorises the request and still fixes the
size and type ceiling, it just does so when issuing the token rather than by handling the bytes.

## How the project is organised

```
prisma/
  schema.prisma            15 models, 3 enums
  migrations/              generated with `prisma migrate diff`
  seed/
    index.ts               full initial seed from src/content
    profile.ts             focused, transactional personal-site content sync
src/
  config/
    site.ts                shared constants, one definition of the featured cap
  content/                 my default content, owned by the app
    projects.ts            26 projects
    copy.ts                editable public-site copy and personal narrative
    cv.ts                  experience, education, certifications
    skills.ts              skill tiers, capabilities, domains
    settings.ts            settings, hero figures, coursework, bulleted cards
  app/
    (public)/              homepage, academic profile, projects, case studies, globals.css
    admin/
      login/               sign in, outside the dashboard shell
      (dashboard)/         every authenticated screen, plus its server actions
    api/
      admin/               project routes, featured toggle, upload tokens
      auth/                NextAuth handler
    preview/card/          renders the real card component for the admin iframe
  components/
    public/                Nav, Hero, ProjectCard, ProjectMedia, sections
    admin/                 FeaturedSelector, ProjectForm, MediaUploader, editors
  lib/
    db.ts                  Prisma singleton
    auth.ts                NextAuth with the credentials provider
    auth.config.ts         edge safe half, imported by middleware
    guard.ts               requireAdmin and the API error shape
    rate-limit.ts          login throttling, backed by Postgres
    queries/               data access, one file per concern
    validation/            Zod schemas, one file per entity
middleware.ts              guards /admin and /api/admin
```

A few rules I held myself to:

- Route handlers authorise, validate with a Zod schema, call a function in `lib/queries`, then
  revalidate. No Prisma calls sit inside components.
- The seed imports from `src/content`, never the other way round. My default content belongs to the
  application, and the seed is only a script that loads it, so runtime code never reaches into
  database tooling.
- `ProjectCard.tsx` is written once and used by the homepage, `/projects` and the admin live preview.
  A second copy styled for the admin would drift from the real card, which would defeat the point of
  having a preview at all.

## Running it locally

Node 20 or newer.

```bash
npm install
cp .env.example .env
```

Then fill in `.env`:

1. **`DATABASE_URL`** from [neon.tech](https://neon.tech). I put mine in AWS eu-central-1 (Frankfurt)
   so it sits beside the Vercel region set in `vercel.json`. Use the **pooled** connection string,
   the one whose host contains `-pooler`. The direct endpoint opens a new connection per serverless
   invocation and will exhaust the connection limit.
2. **`AUTH_SECRET`**, generated with `openssl rand -base64 32`.
3. **`ADMIN_EMAIL`** and **`ADMIN_PASSWORD`** for the account the seed creates. The password has to
   be at least 10 characters and the seed refuses anything shorter.
4. **`BLOB_READ_WRITE_TOKEN`** once blob storage is connected. Without a real token uploads are
   disabled, and the admin says so rather than appearing to work.

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
| `npm run db:profile` | Sync the personal narrative, projects, and supporting profile data |
| `npm run db:studio` | Browse the database |
| `npm run db:reset` | Drop, re-migrate and re-seed. Destroys all data |

## Re-running the seed

It is safe to re-run, but the models do not all behave the same way, and I would rather know that
than find out later:

- **Projects and copy blocks** are upserted by `slug` and `key`. For copy blocks only the label,
  type, grouping and stored original refresh, so text I have edited in the admin survives.
- **Experience, education, certifications, skills and the card lists** are replaced wholesale. Edits
  made through the admin to those are lost on a re-seed.
- **Site settings** are created once and never overwritten.
- **The admin user** is upserted, so re-running after changing `ADMIN_PASSWORD` resets my password.

## The admin account

The seed reads `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_NAME` from the environment. There is no
password hardcoded anywhere in this repository.

```bash
# change the values in .env, then
npm run db:seed
```

Day to day I use **Admin, Account** to change it. That asks for the current password and hashes the
new one with bcrypt at cost 12.

## Deploying to Vercel

1. Push to GitHub.
2. In Vercel, **Add New Project** and import the repository. Next.js is detected automatically.
3. Add environment variables for Production and Preview: `DATABASE_URL`, `AUTH_SECRET`, and
   optionally `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_NAME` if I ever want to seed from there.

   I deliberately leave `NEXT_PUBLIC_SITE_URL` unset. `siteUrl()` falls back to Vercel's own
   `VERCEL_PROJECT_PRODUCTION_URL`, so canonical URLs, OpenGraph tags and the sitemap pick up the
   right domain on their own. I only set it once a custom domain is attached.

4. Deploy. `vercel.json` runs `prisma generate && prisma migrate deploy && next build`, so migrations
   apply themselves on every deploy.
5. Seed the production database once from my machine with the production values set.

`regions` is `fra1` in `vercel.json`, the closest Vercel region to Kigali, and the database and blob
store are both in Frankfurt to match. A mismatch there means every query pays a cross-continent trip.

**If a build cannot reach the database**, a Neon instance that has scaled to zero can refuse the
first burst of connections while the build prerenders 26 project pages in parallel. Redeploying
works, and the pooled connection string makes it far less likely.

## Blob storage

1. Vercel dashboard, then **Storage**, **Create**, **Blob**.
2. Region **fra1**, to match the functions and the database. This cannot be changed later.
3. Access **Public**. The public site renders these images with a plain `<img>` tag, so private
   blobs requiring a token would break every photo on the site.
4. Tick **Add a read-write token env var**, which is what creates `BLOB_READ_WRITE_TOKEN`.
5. Redeploy, because the running deployment was built without the variable.

Limits enforced when the upload token is signed, in `src/app/api/admin/upload/route.ts`:

| Kind | Types | Maximum |
|---|---|---|
| Image | JPG, PNG, WebP | 10 MB |
| Video | MP4, WebM | 100 MB |
| PDF | PDF | 15 MB |

The browser checks too, for a quicker and friendlier refusal, but the browser is not a security
boundary and the signed token is what actually holds. Each token is also bound to a single pathname,
so it cannot be reused to write somewhere else. Removing media from a project deletes the stored
blob as well, so unused files do not pile up.

## Custom domain

1. **Settings, Domains** in Vercel, add the domain.
2. At the registrar, add the records Vercel shows. An apex domain takes an `A` record to
   `76.76.21.21`; `www` takes a `CNAME` to `cname.vercel-dns.com`.
3. Wait for the certificate, usually a few minutes.
4. Set `NEXT_PUBLIC_SITE_URL` to the new origin and redeploy so canonical URLs, OpenGraph tags and
   `sitemap.xml` all follow.

This repository used to publish to GitHub Pages. A Next.js application cannot be served from Pages,
so that deployment is retired.

## The admin dashboard

| Route | What it does |
|---|---|
| `/admin` | Counts, a featured indicator, recently edited projects |
| `/admin/projects` | Featured selector, drag to reorder, search, filters, bulk actions |
| `/admin/projects/new` | Create a project, with a live card preview |
| `/admin/projects/[id]` | Edit or delete |
| `/admin/content` | All editable copy blocks, grouped, with per-field reset |
| `/admin/experience` | Roles and bullets, drag to reorder |
| `/admin/education` | Qualifications, grades, certifications |
| `/admin/skills` | Tiers, levels and skill lists |
| `/admin/capabilities` | What I do, domains, hero figures, coursework, bulleted cards |
| `/admin/settings` | Identity, contact, availability, hero photo, résumé, SEO |
| `/admin/account` | Change password |

Six projects appear on the homepage at a time and that cap is enforced in the database layer, not
only in the interface. Featuring a seventh returns HTTP 409 whether the request comes from the
dashboard or from `curl`.

Every mutation calls `revalidatePath` for `/`, `/projects` and the affected project page, so the
public site reflects a change immediately rather than after a redeploy. Public pages also carry a one
hour `revalidate` as a safety net in case a revalidation is ever missed.

## Security

- Passwords hashed with bcrypt at cost 12.
- Session cookies are `httpOnly`, `sameSite=lax`, and `secure` in production.
- Login is limited to 5 failed attempts per IP per 15 minutes. The counter lives in Postgres because
  serverless instances do not share memory, and it is enforced inside the credentials provider rather
  than in the form, so posting straight to `/api/auth/callback/credentials` is covered too.
- `middleware.ts` guards `/admin` and `/api/admin`, and every mutating route and action calls
  `requireAdmin()` independently, because middleware on its own is not a security boundary.
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

Adossi Fred William, Kigali, Rwanda
