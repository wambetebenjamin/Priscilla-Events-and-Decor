# Vercel Deployment Specification — Priscilla Events and Decor

> **Purpose:** a single checklist you can paste into any AI website-builder prompt so every Next.js site it generates deploys first-try on Vercel (2025-2026) and never hits `Build cache cleared after a dependency security block` or `Vulnerable version of Next.js detected`.
>
> Last verified: **2026-10-19** against `vercel.com/docs`, `vercel.com/changelog`, and `nextjs.org/blog` advisories. Re-verify quarterly.

---

## 0. TL;DR — what just broke and why

```
Build Completed in /vercel/output [1m]
Deploying outputs...
Build cache cleared after a dependency security block. Redeploy to build with a clean cache.
Vulnerable version of Next.js detected, please update immediately.
```

This is **not a code bug** — Vercel completed the build and then refused to *deploy* it:

1. Vercel detected a **known-vulnerable `next` version** (here `15.3.3`) during dependency install.
2. It **wiped the Build Cache** to prevent re-using poisoned artefacts and forced the next deploy to run with `VERCEL_FORCE_NO_BUILD_CACHE=1` semantics.
3. All new deploys pinning that version now fail with `errorCode: VULNERABLE_NEXTJS_VERSION` (see `vercel.link/CVE-2025-66478`). The only fix is to bump to a patched release and redeploy.

You must treat a Vercel security block as P0 — no workaround flag (`DANGEROUSLY_DEPLOY_VULNERABLE_CVE_2025_66478=1`) is acceptable for production.

---

## 1. Runtime — Node.js

| Rule | Value | Source |
|------|-------|--------|
| **Vercel supported Builds & Functions (2026)** | `24.x` (default, Active LTS until 2028-04-30) and `22.x` (Maintenance LTS until 2027-04-30). `20.x` is EOL 2026-04-30 and **removed Oct 1 2026** — new deploys targeting it fail. `18.x` already removed. | `vercel.com/docs/functions/runtimes/node-js/node-js-versions`, changelog `2025-11-25` (Node 24 GA), `2026-07-14` (Node 20 deprecation) |
| **Pin format** | **Exactly** `24.x` or `22.x` in *all three* places. Do not use `>=24.0.0`, `^24.0.0`, `24.3.0`, `24.11.0`. Vercel only honours the *major* and auto-rolls minor/patch for security. | Same doc |
| **Where to pin** | 1. `package.json` → `engines.node = "24.x"` (overrides Project Settings on next deploy) 2. `.nvmrc` → `24` **not** `24.3.0` 3. Vercel Dashboard → Project Settings → Build & Deployment → Node.js Version = `24.x` (must match) | Same doc |
| **Local dev must match** | `fnm install 24 && fnm use 24` / `nvm install 24 && nvm use 24`. CI (GitHub Actions, etc.) also `node-version: '24'`. Drift between local/CI/Vercel causes lockfile churn and cache invalidation. | |
| **What NOT to use** | `node:20-alpine` containers keep running but *new* Vercel builds on 20 fail after Oct 1 2026. Node 26 is only in Vercel **Sandboxes**, not Builds/Functions yet — do not set `engines.node = "26.x"` until Vercel advertises it. | Changelog `Node.js 26.x now available on Vercel Sandboxes` 2026-05-12 |

**Correct `package.json` snippet:**
```json
{
  "engines": { "node": "24.x" },
  "packageManager": "npm@10.9.8"
}
```

**Correct `.nvmrc`:**
```
24
```

---

## 2. Framework — Next.js + React (the security block)

This is the section that prevents the `Vulnerable version detected` error.

### 2.1 Patched versions (as of 2026-10-19)

Vercel blocks *any* deploy whose lockfile resolves to an unpatched `next`. The table is cumulative — each advisory adds a new minimum:

| Your current minor | **Minimum patched** you must be on | Why |
|--------------------|-------------------------------------|-----|
| `14.x` (App Router in prod) | `14.2.35` | CVE-2025-55184 DoS + legacy 13/14 advisory |
| `15.0.x` | `15.0.7` | CVE-2025-55183/55184 + React2Shell |
| `15.1.x` | `15.1.11` | same |
| `15.2.x` | `15.2.8` | same + middleware bypass CVE-2025-29927 fix in 15.2.3 |
| `15.3.x` | `15.3.8` (`15.3.9` latest on that branch) | React2Shell fixed in 15.3.6, follow-up in 15.3.8 |
| `15.4.x` | `15.4.10` | same |
| `15.5.x` | **`15.5.9` (Dec 2025) → `15.5.18` (May 2026) → `15.5.28` current** | 13 advisories May 2026 + window-RCE Aug 2026 |
| `16.0.x` | `16.0.10` → `16.2.6` → `16.3.6` → `16.4.2` current | CVE-2026-23870, CVE-2026-44578 SSRF, CVE-2026-94545, etc. |
| `16.x canary` | `16.1.0-canary.12+` | |

**Rule for AI builders:** *Never emit `next: "15.3.3"` or any `15.3.x < 15.3.8`.* Default new projects to **the latest `15.5.x` or `16.x` stable** (`15.5.28` or `16.4.2` today). Check `npm view next version` at generation time.

> Example that triggered this incident: `next@15.3.3` was vulnerable to GHSA-g5qg-72qw-gw5v, GHSA-9qr9-h5gf-34mp (RCE in React flight protocol), GHSA-9g9p-9gw9-jx7f and ~30 other GHSA IDs. `npm audit` reported **critical** and Vercel's deploy gate blocked it.

### 2.2 React pairing

React 19 itself had CVEs. When you bump Next.js, bump React in lockstep:

| Next.js | Minimum React / React-DOM | Minimum `react-server-dom-*` |
|---------|---------------------------|------------------------------|
| `15.3.x` | `19.0.6` | `19.0.6` |
| `15.4.x` + | `19.1.7` | `19.1.7` |
| `15.5.18+` / `16.x` | `19.2.0` recommended | `19.2.6` |

**Do:** `react: "19.2.0", react-dom: "19.2.0"` (or newer) together. **Do not** pin `19.1.0` with a new Next.js — the audit will still fail.

### 2.3 Transitive deps also audited

`npm audit` also flags packages that `next` itself pins. Vercel's hard gate is about the Next.js version, but a clean audit is what keeps the build log (and your security review) quiet:

- `postcss <=8.5.22` → GHSA-qx2v-qp2m-jg93 (XSS in `</style>`) — **Next 15.5.28 still pins `postcss@8.4.31`**
- `sharp <=0.35.5-rc.1` → libvips/libheif/librsvg CVEs (CVE-2026-33327 etc.) — **Next 15.5.28 still pins `sharp@0.34.5`**
- `sprintf-js *` → GHSA-hp3w-g68c-fv3c (unbounded precision) via `gray-matter → js-yaml@3 → argparse → sprintf-js`

Because `next` pins those exact transitive versions, bumping `next` alone does **not** clear them. The fix is npm `overrides` (verified working in this repo):

```json
"overrides": {
  "postcss": "8.5.31",
  "sharp": "0.35.5",
  "sprintf-js": "1.1.3"
}
```

Then `rm -rf node_modules package-lock.json && npm install` and confirm:

```bash
npm ls postcss sharp sprintf-js
# all three resolve to the overridden versions, with no "invalid" entries
npm audit --audit-level=moderate
```

**Known residual (accept + document):** `sprintf-js@1.1.3` is still flagged because *no patched version exists*; `npm audit fix --force` "fixes" it by downgrading `gray-matter` to `2.0.1`, which is nonsense. It is **moderate**, DoS-only, and reachable only if attacker-controlled strings are fed into `sprintf` — here it parses local Markdown frontmatter at build time, so it is not exploitable through the site. Leave it, note it in the PR, and re-check when upstream patches.

**Rules for AI builders:**
- Run `npm audit --audit-level=moderate` before every handoff. `0 critical / 0 high` is mandatory. Moderate findings must be explained.
- Never accept `npm audit fix --force` when it proposes a **major downgrade** (`gray-matter@2`, `next@16` on a 15.x site). Pin an override or document the exception.
- `sharp` is optional for this site because `images.unoptimized: true`; the override keeps the scanner quiet without affecting rendering.

### 2.4 Upgrade procedure (copy-paste)

```bash
# 1. Bump framework (example: 15.3.3 → latest 15.5 patch)
npm install next@15.5.28 react@19.2.0 react-dom@19.2.0
npm install -D @types/react@19.2.0 @types/react-dom@19.2.0 @types/node@24.13.1 typescript@5.9.3

# 2. Regenerate lockfile so Vercel's npm ci sees the patch
rm -rf node_modules package-lock.json
npm install

# 3. Verify locally — must be green before pushing
npm run typecheck   # tsc --noEmit
npm run build       # next build → should list ○ / ● / ƒ routes and exit 0
npm audit --audit-level=moderate   # should show 0 critical/high

# 4. Commit BOTH package.json AND package-lock.json (or pnpm-lock.yaml)
git add package.json package-lock.json .nvmrc
git commit -m "fix: bump Next.js to 15.5.28 (clears Vercel VULNERABLE_NEXTJS_VERSION)"

# 5. Redeploy clean — Vercel will still say "Build cache cleared" once
#    Dashboard → Deployments → … → Redeploy → UNTICK "Use existing Build Cache" → Deploy
#    Next deploy will be warm again.
```

Do **not** set `DANGEROUSLY_DEPLOY_VULNERABLE_CVE_2025_66478=1` to silence the gate — it is a break-glass for incident response only and leaves RCE open.

---

## 3. Project structure & build configuration

| Setting | Required value | Where | Notes |
|---------|----------------|-------|-------|
| **Framework Preset** | `Next.js` | Vercel Dashboard → Project Settings → Framework Preset (auto-detected) | Do not set to `Other` — you lose Next optimizations (ISR, Image, Functions) |
| **Build Command** | `next build` (or `npm run build` if it runs `next build`) | package.json `scripts.build` + Vercel Build Command | No `CI=false` prefix; no `next build && next export` (legacy) — `output: "export"` is the new static-export API |
| **Install Command** | `npm ci` (Vercel default when `package-lock.json` exists) — or `pnpm install --frozen-lockfile` / `yarn install --frozen-lockfile` | Vercel detects from lockfile. Override only in monorepos. | Never commit without a lockfile. Mixed managers (both `package-lock.json` + `pnpm-lock.yaml`) confuse cache detection and can cause `Skipping build cache since Package Manager changed` + phantom failures. |
| **Output Directory** | `.next` (default) — leave blank | Vercel Build Settings | `out/` only if `next.config.js` has `output: "export"` for fully-static sites (then no API routes, middleware, ISR). |
| **Root Directory** | `./` (repo root) unless monorepo — then `apps/web` etc. | Project Settings → Root Directory | |
| **Node Package Manager version** | Pin via `packageManager` field (Corepack) e.g. `"packageManager": "npm@10.9.8"` or `.npmrc` | package.json | Vercel respects `packageManager` for npm 10/11, pnpm 9/10, yarn 4. |
| **Build resource limits** | Build time ≤ 45 min (Hobby/Pro/Enterprise). Build cache ≤ 1.5 GB (Basic/Standard), 3 GB (Enhanced), 4.75 GB (Turbo). | `vercel.com/docs/builds`, `vercel.com/docs/limits` | If cache > 1.5 GB it is *dropped every build* and next build is cold (~4.5 min wasted). Keep `.next/cache` lean; don't upload raw assets to cache. |
| **Ignored Build Step** | Optional: `git diff --quiet HEAD^ HEAD -- apps/web` for monorepos | Project Settings → Git → Ignored Build Step | |

---

## 4. Next.js config — what Vercel expects

### 4.1 `next.config.mjs` / `next.config.js` (ESM)

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Vercel-specific: required for preview sandboxes (e2b, arena)
  // Has NO effect on Vercel production — safe to keep.
  allowedDevOrigins: ['*.e2b.app', '*.arena.ai', 'localhost', '127.0.0.1'],

  // If you serve photography from public/images with explicit width/height
  // (no sharp at build), keep unoptimized:true. Otherwise omit to use
  // Vercel Image Optimization (requires no extra config; AVIF is now
  // auto-disabled for CVE GHSA-2xp9-vwfh-vxw4).
  images: { unoptimized: true },

  // Never hide type errors in prod — remove ignoreDuringBuilds before launch
  // Keep only for preview branches if you must.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },

  async headers() { /* see §4.2 */ },
  async redirects() { /* see §5 */ },
};
export default nextConfig;
```

**Rules:**
- Use `next.config.mjs` (ESM) for Next 15/16. `next.config.ts` also supported.
- `images.unoptimized: true` disables Vercel Image Optimization — acceptable when all images are pre-sized and you bypass sharp to avoid libvips CVEs. If you want Vercel to optimize, delete the key and ensure `sharp` is updated.
- `eslint.ignoreDuringBuilds: true` / `typescript.ignoreBuildErrors: true` are **not** Vercel-recommended for production — Vercel docs show builds *should* type-check. Leave `false`.

### 4.2 `vercel.json` — the production security layer

Because `next dev` needs `eval` for HMR, the strict CSP **must** live in `vercel.json`, not `next.config.js`. Vercel merges both, but `vercel.json` headers apply at the edge *before* Next.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.recaptcha.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data:; img-src 'self' data: blob: https://www.google.com https://maps.gstatic.com https://maps.googleapis.com https://*.googleusercontent.com https://images.pexels.com; frame-src https://www.google.com https://maps.google.com https://www.google.com/maps; connect-src 'self' https://www.google.com https://www.recaptcha.net; media-src 'self' blob:; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-DNS-Prefetch-Control", "value": "on" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=()" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "X-Permitted-Cross-Domain-Policies", "value": "none" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "no-store, no-cache, must-revalidate, max-age=0" }]
    }
  ]
}
```

**Vercel hard requirements:**
- `$schema` must be `https://openapi.vercel.sh/vercel.json` (enables validation in Vercel).
- `framework: "nextjs"` — explicit is better than auto-detect for monorepos.
- Never cache `/api/*` (enquiries, auth). Always `no-store` for API, `immutable` for hashed static assets.
- HSTS with `preload` — only set if the domain is on the HSTS preload list or you intend to submit it.

### 4.3 `next.config.js` headers vs `vercel.json` headers

- **Local dev + Vercel:** `next.config.js` `async headers()` runs at request time (good for dynamic headers).
- **Edge-before-Next:** `vercel.json` `headers` run at Vercel Edge Network, faster and work even if Next crashes.
- This project uses **both**: relaxed headers in `next.config.mjs` (safe for HMR) + strict CSP in `vercel.json` (prod). Keep the split — do not duplicate CSP in both.

---

## 5. Routing — redirects, rewrites, output

- `next.config.js` `async redirects()` is the canonical place for permanent redirects (e.g. `/gallery` → `/portfolio`).
- Do **not** use `.htaccess`, `nginx.conf`, or `_redirects` — Vercel ignores them.
- If `output: "export"` is set, you **cannot** have: API Routes, Middleware/Proxy, `getServerSideProps`, Server Actions, ISR, Image Optimization. Only use for truly static brochure sites deployed to S3/Cloudflare Pages. For Vercel, keep default (`output` unset = serverful + static hybrid).

---

## 6. Environment variables — the 90% cause of "works locally, 500 on Vercel"

| Rule | Detail |
|------|--------|
| **Public vs server-only** | `NEXT_PUBLIC_*` is inlined into the browser bundle at *build* time. Every secret (SMTP, KV, WhatsApp, reCAPTCHA secret, BLOB token) must be **without** that prefix. |
| **Where to set** | Vercel Dashboard → Project → Settings → Environment Variables. Set for **Production**, **Preview**, **Development** separately. Never commit `.env` / `.env.local` — only `.env.example` (keys without values). |
| **Pull locally** | `vercel env pull .env.local` or `npx vercel env pull` — never copy-paste manually (you will miss a variable). |
| **Build-time inlining** | Changing a `NEXT_PUBLIC_*` value requires a **new deployment** (rebuild). It is not read at runtime. |
| **Secrets redaction** | Values ≥32 chars that leak into build logs are auto-redacted as `[REDACTED]` — but don't rely on it; audit logs. |
| **This project's required vars** | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY`, `RECAPTCHA_V2_SECRET_KEY`, `RECAPTCHA_SCORE_THRESHOLD`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `BLOB_READ_WRITE_TOKEN`, `SMTP_HOST/PORT/USER/PASSWORD/FROM`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `WHATSAPP_ACCESS_TOKEN` etc. See `.env.example`. |

### 6.1 ⚠️ `@vercel/kv` is deprecated

`npm install` prints:

```
@vercel/kv@3.0.0: Vercel KV is deprecated. If you had an existing KV store, it should have moved to
Upstash Redis ... For new projects, install a Redis integration from Vercel Marketplace.
```

Vercel KV was migrated to **Upstash Redis** (Marketplace integration). For new sites the AI builder must use `@upstash/redis` (or `ioredis` against the Marketplace connection string), **not** `@vercel/kv`. This repo still ships `@vercel/kv` behind a feature check in `lib/kv.ts` and falls back to a temp-file store when `KV_REST_API_URL` is absent, so a deploy without a Marketplace Redis still boots — but enquiries would not persist across serverless invocations. Provision Upstash Redis in the Vercel Marketplace and copy `KV_REST_API_URL` / `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) into all three environments before launch.

---

## 7. Build cache — how Vercel caches and when it lies

- **What is cached:** `node_modules`, `.next/cache`, `package manager store` — retained ~1 month, max 1.5 GB (Standard).
- **When restored:** Every deploy after the first, *unless* Vercel detects: lockfile change + package manager change, corrupted `.next`, or **dependency security block** (your case) — then it says `Build cache cleared after a dependency security block` and the *next* deploy is cold.
- **"Build Completed but Deploy blocked"** means cache logic is *fine* — the deploy gate, not the build, rejected you. Redeploying with **Use existing Build Cache = unchecked** (Dashboard → Deployments → ⋯ → Redeploy) forces a cold rebuild that picks up the new `package-lock.json`.
- **Env var to force cold:** `VERCEL_FORCE_NO_BUILD_CACHE=1` (skip restore) or `VERCEL_FORCE_NO_BUILD_CACHE_UPLOAD=1` (don't upload new cache). Use for one deploy only, then remove.
- **Never** commit `.next`, `node_modules`, `.vercel/output` — they poison the cache. `.gitignore` must list them.

---

## 8. Functions, images, and limits Vercel enforces

| Concern | Limit / default | What to do |
|---------|-----------------|------------|
| Build time | 45 min (all plans) | Keep `next build` under 5 min; profile with `next build --debug`. Huge `public/images` (>1 GB) breaches static upload limit — use Vercel Blob or external CDN. |
| Function bundle size | **250 MB uncompressed** (all plans), Python 500 MB; "Large functions" beta up to 5 GB on Fluid compute | Keep dependencies lean; `@vercel/kv` + `nodemailer` are small, but avoid bundling `sharp`, Playwright, or ffmpeg into a route. |
| Function duration | Hobby: 300 s default and max. Pro/Enterprise: 300 s default, 800 s max, 1800 s extended (beta, Fluid compute) | Set `export const maxDuration = 60` on slow routes (email/WhatsApp fan-out) rather than relying on the default. |
| Function runtime | **Node.js is the default.** Vercel is deprecating the Edge runtime (new projects default middleware to Node.js from 2026-09-01 and warn on edge). | Set `export const runtime = "nodejs"` in API routes; use edge only when you truly need it. |
| `experimental.turbopackFileSystemCacheForBuild` | `false` if you use `fumadocs-mdx` or custom loaders that don't declare deps | Prevents stale MDX after `remark` upgrade (see Vercel discussion #4658). |
| Image Optimization | Vercel Image Optimization is on by default; `unoptimized:true` turns it off. | If you keep `unoptimized`, you must provide `width` + `height` on every `<img>` to avoid CLS. If you enable it, no `sharp` needed — Vercel optimises at the edge. |
| Static files | 100 MB (Hobby) / 1 GB (Pro) per deploy; 15k files max via CLI | Serve videos from Blob/Mux, not `public/`. |

---

## 9. Security & compliance Vercel checks at deploy time

Vercel runs these checks around a deploy:

1. **Vulnerable Next.js gate** — `VULNERABLE_NEXTJS_VERSION` hard-fail if `next` < patched minimum. A bypass flag exists but is audited and must not be used in production.
2. **Security-triggered cache invalidation** — a dependency security block wipes the Build Cache so poisoned artefacts cannot be reused (`Build cache cleared after a dependency security block`).
3. **Secrets** — no automatic safety net you can rely on. Never commit `.env*` (only `.env.example`); Vercel redacts long secret values in build logs, but assume anything printed is public.
4. **Build Output API** — Vercel expects the Next.js output in `.next` and packages it into `.vercel/output` itself. If you override the output directory or set `output: "export"` without telling Vercel, the deploy fails to find it. Leave the defaults.
5. **General dependency audit is on you** — Vercel will not block a deploy for every `postcss`/`sharp` advisory. Run `npm audit` yourself and fix `critical`/`high` before pushing.

**AI builder must:** run `npm audit` and fix all `critical`/`high` before emitting code. If `npm audit fix --force` would bump a major, pin an `overrides` entry instead and regenerate the lockfile.

---

## 10. Deployment workflow — Git → Preview → Production

```
git push → Vercel Git integration → Install (npm ci) → Build (next build)
       → Collect static (.next/static) → Trace serverless functions
       → Deploy outputs → Assign alias (preview-*.vercel.app or prod domain)
```

- **Production deploys:** only from the configured Production Branch (`main`). Use protected previews on Pro/Enterprise where available.
- **Preview deploys:** every PR/push to non-prod branches. Isolated env vars (Preview env).
- **Deploy Hooks:** `?buildCache=false` to skip cache for webhook-triggered builds.
- **Skipping:** `vercel deploy --force` bypasses the deployment cache; `VERCEL_FORCE_NO_BUILD_CACHE=1` skips the build cache for one deploy.

---

## 11. Copy-paste prompt for AI builders

Paste this block verbatim into any AI that scaffolds Next.js sites for Vercel:

```
You MUST generate a Vercel-compliant Next.js 15/16 project:

RUNTIME
- engines.node = "24.x" in package.json, .nvmrc = "24", Vercel Node Version = 24.x
- Never use Node 20/18 — they are deprecated/removed Oct 2026

FRAMEWORK (security-critical)
- Next.js = latest patched on chosen line: 15.5.28+ for 15.x, 16.4.2+ for 16.x, 14.2.35+ for 14.x
- React = 19.2.0+, react-dom = 19.2.0+, @types/node = 24.x, typescript = 5.9.x
- Add npm "overrides" for transitive CVEs next still pins:
    "overrides": { "postcss": "8.5.31", "sharp": "0.35.5", "sprintf-js": "1.1.3" }
- Verify with: npm view next version, npm audit --audit-level=moderate must show 0 critical/0 high
- Commit BOTH package.json AND package-lock.json (or pnpm-lock.yaml). Never mix package managers.

BUILD
- Framework Preset = Next.js, Build Command = "next build", Output = ".next", Install = "npm ci"
- next.config.mjs must have: reactStrictMode true, poweredByHeader false, images.unoptimized only if you avoid sharp, allowedDevOrigins for preview hosts
- vercel.json must have: "$schema": "https://openapi.vercel.sh/vercel.json", "framework": "nextjs", strict CSP + HSTS + no-store for /api/* + immutable for /images/*

ENV
- Never commit .env* secrets; provide .env.example with empty values
- Public vars prefixed NEXT_PUBLIC_* (inlined at build), server secrets without prefix
- Set all vars in Vercel Dashboard for Production + Preview + Development

SECURITY
- You will be blocked if Next.js is unpatched. As of Oct 2026 the floors are 14.2.35 / 15.5.28 / 16.4.2 — always emit the latest patch and re-check npm.
- Never set DANGEROUSLY_DEPLOY_VULNERABLE_CVE_2025_66478=1 to bypass the gate.
- Add the postcss/sharp/sprintf-js overrides above; updating Next.js alone does NOT clear them.
- No .htaccess, no _redirects, no output:"export" if you need API routes
- Use @upstash/redis, not the deprecated @vercel/kv, for new key-value storage

VERIFY BEFORE HANDOFF
- npm run typecheck (tsc --noEmit) → 0 errors
- npm run build → ○ / ● / ƒ route table, no warnings, exit 0
- npm audit → 0 critical/high
- Redeploy on Vercel with "Use existing Build Cache" UNCHECKED after any Next.js bump
```

---

## 12. Checklist for this repo — what was fixed

- [x] `package.json` `next` `15.3.3` → `15.5.28` (clears CVE-2025-66478/React2Shell + May 2026 13-advisory block + Aug 2026 RCE)
- [x] `react`/`react-dom` `19.1.0` → `19.2.0` (paired React 19 patch)
- [x] `@types/node` `26.6.5` → `24.13.1` (align with runtime `24.x`, not future Node 26)
- [x] `@types/react`/`@types/react-dom` → `19.2.0` (match React 19.2)
- [x] `.nvmrc` `24.3.0` → `24` (Vercel expects major-only)
- [x] `engines.node` `>=24.0.0` → `24.x` (Vercel canonical format)
- [x] `packageManager` field added (`npm@10.9.8`) for deterministic Vercel install
- [x] `next.config.mjs` comment updated to reflect the new pinned versions
- [x] npm `overrides` added: `postcss@8.5.31`, `sharp@0.35.5`, `sprintf-js@1.1.3`
- [x] `package-lock.json` regenerated and verified with `npm ci` (the exact Vercel install command)
- [x] `npm run typecheck` → 0 errors
- [x] `npm run build` → Next.js 15.5.28, 41 static pages, `○ / ● / ƒ` route table, exit 0
- [x] `npm audit --audit-level=moderate` → **0 critical, 0 high**; 4 moderate remaining, all the unfixable `sprintf-js` chain (see §2.3)
- [x] Next Vercel deploy will show `Build cache cleared after a dependency security block` **once** — expected, self-heals on the following deploy

**Rollback note:** if 15.5.28 introduces a runtime regression, the minimum safe version on the 15.3 line is **15.3.9** (15.3.8 patched, 15.3.9 latest), but you must keep the three overrides, and you should plan to move to the 15.5 line for the May/Aug 2026 fixes.

---

## 13. References (official, not blogspam)

- Vercel Node versions: `vercel.com/docs/functions/runtimes/node-js/node-js-versions`
- Node 24 GA changelog: `vercel.com/changelog/node-js-24-lts-is-now-generally-available-for-builds-and-functions` (2025-11-25)
- Node 20 deprecation: `vercel.com/changelog/node-js-20-is-being-deprecated` (2026-07-14)
- Block vulnerable Next.js: `vercel.com/changelog/new-deployments-of-vulnerable-next-js-applications-are-now-blocked-by` (2025-12-05)
- React2Shell bulletin: `vercel.com/kb/bulletin/react2shell` + `vercel.com/kb/bulletin/security-bulletin-cve-2025-55184-and-cve-2025-55183` (2025-12-11)
- CVE-2025-66478 advisory: `nextjs.org/blog/CVE-2025-66478`
- May 2026 13-advisory release: `vercel.com/changelog/next-js-may-2026-security-release` + summary `GHSA-vfv6-...`, `CVE-2026-44578` SSRF
- Aug 2026 RCE release: `vercel.com/changelog/nextjs-august-2026-security-release` (GHSA-2xp9-vwfh-vxw4, GHSA-p293-qw3h-jr36)
- Build cache controls: `vercel.com/docs/deployments/troubleshoot-a-build#managing-build-cache`
- Build limits: `vercel.com/docs/limits` + `vercel.com/docs/builds`
- `vercel.json` schema: `vercel.com/docs/project-configuration/vercel-json`

---

## Appendix A — Current lock (after fix)

```
Node:      24.x (Vercel) / 22.22.3 local sandbox — Vercel will run 24
Next:      15.5.28
React:     19.2.0 / react-dom 19.2.0
Types:     @types/node 24.13.1, @types/react 19.2.0, @types/react-dom 19.2.0, typescript 5.9.3
Overrides: postcss 8.5.31, sharp 0.35.5, sprintf-js 1.1.3
Audit:     0 critical, 0 high, 4 moderate (sprintf-js chain, no upstream fix)
Build:     41 static pages, ○ / ● / ƒ, exit 0
```

## Appendix B — How to re-verify in 60 seconds

```bash
node --version          # 24.x on Vercel (24.11.0 at time of writing)
npm view next version   # compare to package.json next
npm audit               # 0 critical/high expected
npm run build           # must list ○ / ● / ƒ routes, exit 0
```

If any command fails, do not push to `main` — Vercel will block.

## Appendix C — The exact `package.json` fields Vercel reads

```json
{
  "engines": { "node": "24.x" },
  "packageManager": "npm@10.9.8",
  "dependencies": {
    "next": "15.5.28",
    "react": "19.2.0",
    "react-dom": "19.2.0"
  },
  "devDependencies": {
    "@types/node": "24.13.1",
    "@types/react": "19.2.0",
    "@types/react-dom": "19.2.0",
    "typescript": "5.9.3"
  },
  "overrides": {
    "postcss": "8.5.31",
    "sharp": "0.35.5",
    "sprintf-js": "1.1.3"
  }
}
```

Plus `.nvmrc` containing exactly `24` (no patch) and `package-lock.json` committed alongside.
