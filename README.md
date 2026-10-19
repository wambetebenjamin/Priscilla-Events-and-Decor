# Priscilla Events and Decor

Marketing and enquiry site for Priscilla Events and Decor, Nairobi — floral design, event styling
and venue dressing. Built with Next.js (App Router), TypeScript and self-hosted fonts.

## Stack

| Piece | Version |
|-------|---------|
| Node.js | `24.x` (`.nvmrc`, `engines.node`, Vercel Project Settings must all agree) |
| Next.js | `15.5.28` (patched; older versions are refused by Vercel) |
| React / React DOM | `19.2.0` |
| TypeScript | `5.9.3` |
| Styling | Bootstrap 5.3.3 + `app/styles/*.css` (design tokens carried from TheEvent) |
| Storage | `@vercel/kv` with a temp-file fallback — see `lib/kv.ts` (migrate to Upstash Redis before launch) |

## Commands

```bash
npm ci            # install exactly what Vercel installs
npm run dev       # local dev server
npm run typecheck # tsc --noEmit
npm run build     # production build (must exit 0 before pushing)
npm start         # serve the production build
npm run fonts     # regenerate self-hosted fonts from @fontsource packages
npm run images    # regenerate /public/images from the curated source set
```

## Deploying to Vercel

**Read [`VERCEL_SPEC.md`](./VERCEL_SPEC.md) first.** It documents the platform requirements that
blocked the previous deploy (`VULNERABLE_NEXTJS_VERSION`, security cache clear), the exact version
floors, `vercel.json` headers, environment variables, and the verification steps.

[`VERCEL_PROMPT.txt`](./VERCEL_PROMPT.txt) is the same contract as a plain-text prompt you can
paste into any AI website builder so new projects meet Vercel's requirements on the first try.

Short version before every push:

```bash
npm ci && npm run typecheck && npm run build && npm audit --audit-level=moderate
```

Expect **0 critical / 0 high**. The four remaining moderate findings are the `sprintf-js` chain
brought in by `gray-matter`; no upstream fix exists without a breaking downgrade, and it is not
reachable from user input (see `VERCEL_SPEC.md` §2.3).

## Environment variables

Copy `.env.example` to `.env.local` for development, and set the same names in the Vercel project
for **Production**, **Preview** and **Development**. `NEXT_PUBLIC_*` values are inlined at build
time; everything else is server-side only. No secret is ever committed.

## Layout

```
app/            routes, API handlers, global styles
components/     page sections and UI
content/blog/   MDX articles
lib/            site constants, SEO, storage, validation, mail, WhatsApp
public/         fonts and images (served as-is)
scripts/        reproducible font and image pipelines
```

## Notes

- `images.unoptimized` is on: photography is pre-sized and authored with explicit
  `width`/`height`, so no `sharp` is needed at build time.
- `next.config.mjs` redirects legacy paths (`/gallery`, `/enquiry`, `/booking`, legal aliases).
- Security headers live in two places by design: relaxed headers in `next.config.mjs` (safe with
  HMR) and the strict CSP + HSTS in `vercel.json` (production edge).
