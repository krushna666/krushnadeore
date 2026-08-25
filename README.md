# OlyxMedia

Production website + CMS for OlyxMedia, a social media and digital marketing agency in Baner, Pune.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Prisma · PostgreSQL · Auth.js (credentials)

## What's here

- **Public site** — home, services, industries, local SEO location pages, case studies, portfolio,
  testimonials, pricing, blog, glossary, resources, search, legal pages.
- **Admin CMS** at `/admin` — blog (rich text editor, drafts/scheduling/SEO fields), categories, tags,
  authors, media library, client logos (with a Verified/Portfolio/Partner/Brands-We-Admire model so nothing
  fake is ever shown as a client), testimonials, case studies, portfolio, services, industries, locations,
  FAQs, glossary, redirects, leads CRM, newsletter, backlink outreach tracker, users, site settings, and an
  internal SEO content-quality dashboard.
- **Lead capture** — validated, rate-limited, honeypot-protected contact form wired to the Lead CRM and an
  email notification.
- **SEO** — per-page metadata, JSON-LD (Organization/LocalBusiness/WebSite/Service/Article/Breadcrumb/FAQ),
  dynamic `sitemap.xml`, `robots.txt`, `rss.xml`, and a CMS-managed redirect table.

No fake client logos, testimonials, case-study metrics or reviews are seeded. Placeholders are labeled and
meant to be replaced through `/admin` with real, permission-cleared data.

## Local development

Requirements: Node 20.9+, a PostgreSQL database (local via Docker, or any hosted Postgres).

```bash
cp .env.example .env      # fill in DATABASE_URL, AUTH_SECRET, etc.
docker compose up -d      # starts local Postgres on :5432 (skip if pointing at a hosted DB)

npm install
npx prisma migrate dev    # creates the schema
npm run db:seed           # creates the first ADMIN user + starter content

npm run dev
```

Generate `AUTH_SECRET` with `openssl rand -base64 32`.

The seed script creates one ADMIN user from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`, forced to
change their password on first login.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Run Prisma migrations in dev |
| `npm run db:push` | Push schema without a migration (prototyping only) |
| `npm run db:seed` | Seed the admin user + starter content |
| `npm run db:studio` | Prisma Studio |

## Scheduled blog publishing

`GET /api/cron/publish-scheduled` flips any `SCHEDULED` post whose `scheduledAt` has passed to `PUBLISHED`.
Call it on a schedule (Vercel Cron, GitHub Actions, any external scheduler) with:

```
Authorization: Bearer $CRON_SECRET
```

## File storage

Media uploads are written to `public/uploads` via `src/lib/storage.ts`. That's fine for a single persistent
server, but most serverless hosts (Vercel included) have an ephemeral filesystem — swap `saveUploadedFile`
for an S3/R2-backed implementation before deploying there. Every caller only depends on its return shape
(`{ url, filename, mimeType, size }`), so no call sites need to change.

## What's scaffolded but not content-complete

The spec behind this build asked for the full agency-site feature set — 40+ service pages, a full city ×
service location matrix, CSV bulk import for every content type, an AI content-assist layer, a 150-logo wall,
etc. Building all of that to genuine, non-thin, non-fabricated content depth in one pass isn't realistic, so:

- **Services/industries/locations**: the full catalog exists in the database (see `prisma/seed.ts`), but only
  a handful are marked `PUBLISHED` with real copy (Social Media Marketing, SEO, Google Ads, Branding, Website
  Development, Lead Generation; Healthcare, Real Estate, Restaurants; Pune + Baner). The rest are seeded as
  `DRAFT` — add real copy via `/admin` and flip to Published; no code changes needed.
- **CSV import** is fully implemented for Client Logos (`/admin/clients`) as the reference pattern; the same
  parse/preview/confirm shape can be copied for Testimonials/Blog if needed.
- **AI content-helper fields** in the blog editor (generate title/meta/outline/FAQ) were not built — flagged
  in the plan as optional and gated behind `ANTHROPIC_API_KEY`, off by default either way.
- Real team bios, case-study metrics, testimonials, client logos, social links, and the Google Maps embed are
  intentionally left blank/placeholder — fill them in via `/admin` once real, verified data exists. Never
  hardcode fabricated claims here.

## Deployment

Works on Vercel, Railway, Render, or any Node host. For a low-cost deployment, Supabase can provide both
PostgreSQL and Storage, while Vercel runs the Next.js application. Set every variable from `.env.example`,
including `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET`. Create a public
Supabase Storage bucket with the configured name (the default is `media`). The service-role key is used only
by server actions and must never be exposed as a `NEXT_PUBLIC_*` variable.

Point `DATABASE_URL` at the Supabase Postgres connection string, run `npx prisma migrate deploy` as part of
your build/release step, and configure the cron endpoint above if you want scheduled posts to publish
automatically. Media uploads are stored in Supabase Storage instead of the local filesystem, so they persist
across serverless deployments.
