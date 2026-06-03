# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Personal Hugo blog hosted on GitHub Pages at https://virgoc0der.github.io/. Active theme is `posthog-blog` (set in `hugo.toml`). The repo also contains two unused legacy theme submodules (`bootstrap`, `loveit`) — only `posthog-blog` is rendered.

## Local development

```bash
hugo server          # dev server at http://localhost:1313/
hugo --minify        # production build into ./public/
```

Tests / lint / typecheck don't exist — this is a content + template repo.

To preview production behavior locally (e.g. PostHog snippet injection):

```bash
HUGO_PARAMS_POSTHOG_APIKEY=phc_yourtestkey hugo --environment production --destination /tmp/out
```

Note: `hugo server` runs as non-production, so `hugo.IsProduction`-gated code (PostHog) intentionally does NOT execute locally.

## Deployment

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) → builds with Hugo 0.145.0 (extended) → publishes to `gh-pages` branch → GitHub Pages serves it. There is no preview environment; `main` is production.

CDN cache (`cache-control: max-age=600`) means new deploys can take a few minutes to appear on the live URL. Always verify changes by inspecting `git show origin/gh-pages:<path>` rather than trusting an immediate `curl` of the live URL.

## Secrets

The only secret in CI is `POSTHOG_API_KEY` (a public, write-only `phc_*` Project API key — not actually sensitive, but injected via secret to keep the value out of the repo and easy to rotate). It reaches Hugo through the env var `HUGO_PARAMS_POSTHOG_APIKEY`, which Hugo maps onto `Site.Params.posthog.apiKey`.

Never read or echo `.env*` files. Never commit anything resembling a credential, even if the value is technically public — route it through `secrets.*` in the workflow.

## Architecture: how a page is built

The `posthog-blog` theme drives everything. Key inheritance:

- `themes/posthog-blog/layouts/_default/baseof.html` is the master template. All pages — single posts, lists, taxonomy pages, the home page — inherit from it. **This is where to add anything that should appear on every page** (analytics, SEO meta, favicons, verification tags).
- Section-specific templates (`single.html`, `list.html`, `taxonomy.html`, `term.html`, plus overrides in `about/`, `now/`) fill the `{{ block "main" . }}` slot.
- Partials live in `themes/posthog-blog/layouts/partials/`. The `mascot-mark.html` SVG is the visual brand mark; the favicon at `static/favicon.svg` is a sibling design (green `</>` on dark), not derived from the mascot.

The `head` section of `baseof.html` is dense and order-sensitive. Sections in current order: favicons → webmaster verification → SEO title/description → canonical → Open Graph → Twitter Card → JSON-LD (BlogPosting for `posts`, WebSite for home) → fonts → CSS → RSS → PostHog snippet (gated on `hugo.IsProduction` AND `Site.Params.posthog.apiKey`).

JSON-LD is built via `dict` + `merge` + `jsonify | safeJS` — not as raw template string interpolation. Earlier attempts at the latter caused double-escaping (`"\"Title\""`) and `+` artifacts. Preserve the dict-based pattern when extending.

## Content conventions

Posts live in `content/posts/`. Most use YAML front matter (`---`); `golang-docker.md` uses TOML (`+++`) — both work, both flow through the same `description` lookup. The `head` template's description resolution is:

1. `Params.description` (set in front matter)
2. Auto-generated `.Summary` (first ~70 words), truncated to 160 chars
3. Site-level `Params.description` (final fallback)

When adding new posts, give them an explicit `description` (80–160 chars, keyword-rich) — relying on auto-summary produces weak SERP snippets.

OG image falls back from `Params.cover` → `Site.Params.ogImage` (`static/og-image.png`, 1200×630). Twitter Card auto-upgrades from `summary` to `summary_large_image` when an OG image is present.

## Adding configuration

Site-wide knobs go in `hugo.toml` under `[params]` (or nested tables like `[params.posthog]`, `[params.verification]`). Templates read them via `.Site.Params.<key>`. The `[params.verification]` block (Google/Bing/Baidu) is the canonical pattern for adding new webmaster tools — wire a new key into the existing `Webmaster verification` block in `baseof.html`.

`hugo.toml` field order matters: TOML inline tables and `[[array.tables]]` must come AFTER scalar params and single tables, otherwise they swallow trailing keys. `[params.posthog]` etc. sit between `description`/`github` and the `[[params.now]]` / `[[params.stack]]` arrays — keep new tables in that band.

## Browser quirks worth remembering

- Dia browser (and most privacy-focused setups) block `*.i.posthog.com` at the engine level even in incognito. Chrome incognito succeeds because it only disables extensions. Don't chase phantom "PostHog broken" reports — verify in plain Chrome first.
- GitHub Pages CDN caches HTML for 10 minutes. A fresh `curl` to the live URL after a deploy may serve stale content from edge caches — `git show origin/gh-pages:path` is the source of truth.

## Don't

- Don't touch the `themes/bootstrap` or `themes/loveit` submodules — they're dead code, kept around only because removing them touches `.gitmodules` and risks breaking `submodules: true` in the workflow.
- Don't commit anything inside `node_modules/` or `public/`.
- Don't add commits that print any portion of an API key value to CI logs, even truncated — patterns like `${VAR:0:4}` defeat GitHub's secret masking.
