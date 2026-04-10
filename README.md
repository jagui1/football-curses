# NFL Hex Zone

A static, witch-themed Angular site for submitting playful “curse” requests against NFL players. Friends see curses on a shared board; data lives in the browser (`localStorage`). Full product intent is described in **`docs/nfl-hex-zone-spec.md`** (software / PRD). This README summarizes the **technical approach** from **`docs/nfl-hex-zone-technical-spec.md`** and how work is **phased** in **`docs/nfl-hex-zone-TODO.md`**, including current progress.

---

## Technical overview (from the technical spec)

| Area | Approach |
|------|----------|
| **Framework** | Angular 17+ with **standalone** components (no `NgModule` for features). |
| **Language** | TypeScript 5+ for models, services, and UI. |
| **Styling** | Component-scoped CSS plus **global design tokens** and animations in `nfl-hex-zone/src/styles.css` (`:root` CSS variables). |
| **Fonts** | Google Fonts: Creepster, Permanent Marker, Cabin (see `src/index.html`). |
| **Rosters** | Generated once into `src/app/data/rosters.data.ts` via `scripts/generate-rosters.mjs` (ESPN public API); no roster calls at runtime. |
| **Persistence** | `localStorage` under the key `hexzone_curses`, managed by `CurseStoreService` (Angular signals). |
| **Images** | ESPN CDN patterns for team logos and player headshots; emoji fallbacks on image error. |
| **Build / deploy** | Angular CLI (`ng build`); **`.github/workflows/deploy.yml`** (repo root) runs `npm ci`, `hash-passwords.mjs` with secrets, production `ng build --base-href /nfl-hex-zone/`, deploys `nfl-hex-zone/dist/nfl-hex-zone/browser` to the **`gh-pages`** branch via **peaceiris/actions-gh-pages**. |

**Layout (conceptual):** single page with header (title + curse counter), curse form, hex board (card grid), **Cursed Archives** (collapsible NFL-week buckets + week pills), Witch’s Verdict feed (timeline of judged curses), full-screen hex overlay on submit, **Admin clear-all** (password + confirmation, skull sweep), and Witch password modal.

**Auth / passwords:** `nfl-hex-zone/scripts/hash-passwords.mjs` reads `WITCH_PASSWORD` and `ADMIN_PASSWORD` from the environment, hashes them with `bcryptjs` (cost 12), and writes `nfl-hex-zone/src/app/auth/password-hashes.ts` (gitignored). Copy **`nfl-hex-zone/.env.example`** to `nfl-hex-zone/.env`, set values, then run the script before `ng serve` / `ng build`. Plain passwords never belong in git; `npm run test:ci` generates hashes using fixed CI test secrets.

---

## Repository layout

| Path | Role |
|------|------|
| **`docs/nfl-hex-zone-spec.md`** | Software / PRD: UX, legal notes, Witch mode, admin, archives. |
| **`docs/nfl-hex-zone-technical-spec.md`** | Stack, file structure, models, services, scripts, CSS tokens, animations. |
| **`docs/nfl-hex-zone-TODO.md`** | **Canonical phased checklist** with acceptance criteria. |
| **`nfl-hex-zone/`** | Angular application (run commands from this directory). |
| **`.github/workflows/deploy.yml`** | GitHub Actions: build + deploy to GitHub Pages (requires repo secrets `WITCH_PASSWORD`, `ADMIN_PASSWORD`). |

---

## Phases (high level)

Work is organized so **each phase delivers a shippable slice**. Details and checkboxes live in **`docs/nfl-hex-zone-TODO.md`**.

| Phase | Theme | What it delivers |
|-------|--------|-------------------|
| **1 — Foundation** | Scaffold & shell | `ng new` project, models, generated rosters + curse flavors, global tokens/fonts/cursor/keyframes, static component shells. |
| **2 — Core data flow & Hex Board** | Usable app | `RosterService`, `SeasonService`, `CurseStoreService`, reactive curse form with image dropdowns, hex board + cards, header counter, submit overlay. |
| **3 — Visual polish** | Look & motion | Floating emoji + star field, form cauldron glow, card entrance animation, verdict-feed pulse styles, accessibility/responsive pass. |
| **4 — Witch mode & verdicts** | Witch UX | Password hashing script, `AuthService`, Witch modal, verdict controls on cards, verdict feed behavior tied to auth. |
| **5 — Admin & archives** | Power tools | Admin clear-all flow, cursed archives by NFL week, week filter pills, CI deploy to GitHub Pages. |

*(Later items in the TODO file may name additional polish or deployment tasks—see the doc.)*

---

## Progress (summary)

> **Source of truth:** checkbox list in **`docs/nfl-hex-zone-TODO.md`**.

| Phase | Status (summary) |
|-------|-------------------|
| **Phase 1** | **Complete** — all Phase 1 items marked done in the TODO. |
| **Phase 2** | **Complete** — all Phase 2 items are marked done in the TODO. |
| **Phase 3** | **Complete** — all Phase 3 items are marked done in the TODO. |
| **Phase 4** | **Complete** — password hash script, `AuthService`, Witch modal (triple-click title or `?witch=true`), verdict controls on hex-board cards, Witch’s Verdict feed (TODO **4.1–4.6**). |
| **Phase 5** | **Complete** — Admin password modal + burn confirmation + skull sweep + toast; `CursedArchivesComponent` (week buckets, pills, smooth expand); deploy workflow (TODO **5.1–5.5**). |

For **exact** per-task status, open **`docs/nfl-hex-zone-TODO.md`** and search for `- [ ]` vs `- [x]`.

### GitHub Pages (operator checklist)

1. Add repository **Secrets**: `WITCH_PASSWORD` and `ADMIN_PASSWORD` (same values you use locally for `hash-passwords.mjs`).
2. Push to **`main`** — the **Deploy NFL Hex Zone to GitHub Pages** workflow should run (see **Actions**).
3. In the repo **Settings → Pages**, set the source to the **`gh-pages`** branch (folder `/` or root).
4. The site is served with **`--base-href /nfl-hex-zone/`** — use a repository named **`nfl-hex-zone`** or adjust that flag and the workflow `publish_dir` if your Pages URL differs.

---

## Local development

From **`nfl-hex-zone/`**:

```bash
npm install
# Optional: refresh roster data from ESPN (network required)
node scripts/generate-rosters.mjs

# Required once per clone (or when changing passwords): generate auth hashes.
# Set WITCH_PASSWORD and ADMIN_PASSWORD (see .env.example in this directory), then e.g.:
#   export WITCH_PASSWORD=… ADMIN_PASSWORD=…   # bash/zsh
#   npm run hash-passwords
# Or: node --env-file=.env scripts/hash-passwords.mjs  (Node 20+ if you use a .env file)

npm start
# http://localhost:4200
```

Run **`npm run hash-passwords`** whenever `src/app/auth/password-hashes.ts` is missing or after changing `WITCH_PASSWORD` / `ADMIN_PASSWORD`. The file is listed in `.gitignore` and is not committed.

**Tests** (CI-style):

```bash
npm run test:ci
```

**Build:**

```bash
# Ensure password-hashes.ts exists (same env vars as above), then:
npm run build
```

---

## Documentation index

- **Product & behavior:** `docs/nfl-hex-zone-spec.md`
- **Implementation details:** `docs/nfl-hex-zone-technical-spec.md`
- **Tasks & acceptance criteria:** `docs/nfl-hex-zone-TODO.md`
