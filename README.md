# Billy's Blog

Personal blog at **[virgoc0der.github.io](https://virgoc0der.github.io/)** — notes from a backend developer working on Go, AI, and MCP.

Built with [Hugo](https://gohugo.io/) and deployed automatically to GitHub Pages on every push to `main`.

---

## Stack

- **Static site generator**: Hugo `0.145.0` (extended)
- **Theme**: `posthog-blog` (custom, lives in this repo at `themes/posthog-blog/`)
- **Styling**: Tailwind CSS v4 + PostCSS
- **Analytics**: PostHog (production only)
- **Hosting**: GitHub Pages via GitHub Actions

## Local development

Requires Hugo `0.145.0+` extended and Node `20+`.

```bash
git clone --recurse-submodules https://github.com/virgoC0der/virgoC0der.github.io.git
cd virgoC0der.github.io
npm ci
hugo server
```

Open http://localhost:1313/.

Analytics is intentionally disabled in dev (`hugo.IsProduction` is false), so local browsing won't pollute the production PostHog project.

To preview the production build (with analytics enabled):

```bash
HUGO_PARAMS_POSTHOG_APIKEY=phc_yourkey hugo --environment production
```

## Writing a post

```bash
hugo new content posts/my-new-post.md
```

Front matter checklist:

- `title` — clear, search-friendly
- `description` — 80–160 characters; this is what shows up in Google search results and social share cards
- `date` — ISO-8601
- `tags` and `categories`
- Optional `cover` — relative path to an image; will be used as the Open Graph image for that post

## Deploy

Push to `main`. GitHub Actions builds and publishes to the `gh-pages` branch; GitHub Pages serves from there. Allow a few minutes for the CDN edge cache to refresh.

The PostHog API key is injected at build time from the `POSTHOG_API_KEY` repository secret — the repo itself never contains it.

## Project layout

```
content/        Posts and pages (Markdown)
themes/
  posthog-blog/   Active theme — all rendering happens here
  bootstrap/      Unused legacy theme (do not touch)
  loveit/         Unused legacy theme (do not touch)
static/         Files copied to the site root (favicon, og-image, etc.)
hugo.toml       Site config + Hugo Params
```

See [`CLAUDE.md`](./CLAUDE.md) for detailed architecture notes — including how SEO meta is assembled, where the analytics gate lives, and quirks worth remembering.

## About the author

Backend developer working on Go / AI / MCP. Find me at [@virgoC0der](https://github.com/virgoC0der).

## License

Code: MIT. Content (posts under `content/`): all rights reserved by the author.
