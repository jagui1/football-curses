# 🧙‍♀️ NFL Hex Zone — Software Specification

---

## 1. Project Overview

**Project Name:** The NFL Hex Zone  
**Type:** Static frontend website  
**Hosting:** GitHub Pages  
**Audience:** A private friend group  
**Purpose:** A chaotic, funny witch-themed site where users submit requests for a designated "Curse Witch" friend to hex NFL players. All curse requests are displayed on the site itself — no external notification system required.

---

## 2. Legal & IP Considerations

| Asset | Status | Recommendation |
|---|---|---|
| NFL team **names** (e.g. "Kansas City Chiefs") | ✅ Generally safe for non-commercial personal use | Use freely |
| NFL team **logos** | Pull from ESPN's public CDN — widely used by hobby/fan sites; For personal, non-monetized use |
| Player **names** | ✅ Names alone are not copyrightable | Use freely |
| Player **headshots** (official NFL/team photos) | Use ESPN's publicly served player headshot URLs (same caveat as logos) OR fall back to a position-based emoji if image fails to load |
| Player **likenesses** (drawings, caricatures) | ✅ Safe if original art | Can use custom emoji or illustrated placeholders |

> **Bottom line:** For a personal, non-commercial GitHub Pages site shared among friends, using ESPN CDN assets is a common and accepted practice in the fan/hobby community.

---

## 3. Pages & Layout

The site is a **single page** with five visual sections stacked vertically.

### 3.1 Header / Hero

- Large witchy title: **"THE NFL HEX ZONE"**
- Tagline (randomly picked on load): e.g. *"Where fumbles are ordained"*, *"She hexed him first"*, *"No refunds on curses"*
- Animated floating emojis in the background: 🧙‍♀️ 🏈 💀 🪄 🔮 ☠️ 🏟️
- A **Curse Counter** badge showing the total number of players hexed to date

### 3.2 Curse Submission Form

- A visually distinct card with a glowing border
- All form fields described in Section 4
- A prominent submit button: **"Cast the Hex 🔮"** — triggers a dramatic animation on click

### 3.3 The Hex Board (Curse Feed)

- Scrollable card grid of all previously submitted curse requests
- Newest curses appear at the top
- Each card displays:
  - Team logo
  - Player headshot (with emoji fallback)
  - Player name & position
  - Submitter's name
  - Reason for the curse
  - Curse intensity level
  - A randomly assigned funny curse flavor text
  - Timestamp
  - **Witch's Verdict status badge** (see Section 8)
- A **"🗑️ Clear All Hexes"** button with a confirmation step before deleting

### 3.4 Curse History by Week (NEW)

- A collapsible section below the main Hex Board, labeled **"📅 The Cursed Archives"**
- Curse cards are organized into labeled week buckets: **"Week 1"**, **"Week 2"**, etc., based on the NFL week selected at submission time
- Each week bucket is collapsible — expanded by default for the current week, collapsed for all prior weeks
- Week buckets display a summary count badge: e.g. *"Week 3 — 7 curses"*
- Cards within each bucket are sorted newest-first
- The current NFL week is auto-detected via a hardcoded season start date (see Section 9.2); users can also manually override the week on any submitted curse
- A **week filter** at the top of the section allows users to jump directly to any week

### 3.5 Witch's Verdict Feed (NEW)

- A dedicated section labeled **"🔮 The Witch Has Spoken"**
- Displays only curses that have been marked with a verdict: **"Cast ✅"** or **"Pending 🕯️"**
- Cards appear in a stylized vertical timeline layout, ordered by verdict timestamp (most recent first)
- Cast curses glow green; Pending curses glow amber
- If no verdicts have been issued yet, a placeholder reads: *"The cauldron is warming... patience, mortal."*
- The Witch's Verdict feed is read-only for regular users; the Witch manages verdicts via the mechanism described in Section 8

---

## 4. Form Fields

| Field | Type | Details |
|---|---|---|
| **Your Name** | Text input | Who is submitting the request; placeholder: *"Your witch name"* |
| **Select Team** | Image dropdown | All 32 NFL teams with logos, sorted alphabetically by city |
| **Select Player** | Image dropdown | Populates automatically when a team is chosen; shows player headshot + name + position; defaults to *"Pick a team first 🧙"* |
| **Why do they deserve it?** | Textarea | Free text; placeholder: *"He dropped a wide-open pass and I lost $20"*; 280 character limit with live counter |
| **Curse Intensity** | Styled radio buttons | 🌶️ Mild Jinx · 🔥 Full Hex · ☠️ ETERNAL DAMNATION |
| **NFL Week** | Number input / stepper | Defaults to the current auto-detected NFL week (see Section 9.2); user can manually adjust; range 1–22 |

### Team Dropdown Behavior
- Shows team logo alongside team name for every option
- Native `<select>` is replaced with a custom JS-powered dropdown to support images

### Player Dropdown Behavior
- Re-populates instantly when a team is selected
- Shows player headshot thumbnail, name, and position abbreviation per option
- If a headshot fails to load, falls back to a position-based emoji (e.g. QB = 🎯, WR = 🏃, K = 🦵)

---

## 5. Curse Flavor Texts

Each submitted curse is automatically assigned a randomly selected funny flavor text from a pre-written list of 30–50 options. Examples:

- *"May his cleats always be slightly too tight."*
- *"May he fumble every time his mom is watching."*
- *"May his Madden rating drop by 3 every week."*
- *"May his touchdown celebration get flagged for taunting."*
- *"May he always be one yard short of a first down."*

The flavor text is stored permanently with the curse record and displayed on its card.

---

## 6. Animations & Visual Effects

| Effect | Trigger |
|---|---|
| Floating background emojis | Page load — continuous |
| Cauldron bubble/glow effect | Continuous on the form card |
| Hex cast animation | Form submission — full-screen purple flash + spinning 🔮 for ~1.5 seconds |
| Card entrance animation | Each new curse card slides in with a glow flash |
| Custom witch cursor | Always active across the whole page |
| Intensity selector wiggle | On hover/selection of intensity options |
| Star field background | Page load — randomly twinkling stars |
| Verdict badge pulse | Cast ✅ cards pulse green on load in the Witch's Verdict Feed |
| Password input shake | On each failed Witch Mode password attempt |
| Witch Mode activation flash | Brief purple flash when correct password is entered |
| Week bucket expand/collapse | Smooth height transition when a week bucket is toggled |

---

## 7. Data Persistence

All curse submissions and Witch's Verdict status are saved locally in the user's browser via `localStorage`. Curses survive page refreshes and browser restarts. No account or login is required — anyone who opens the site on the same device can see and submit curses.

**Data shape per curse record:**

```json
{
  "id": "uuid",
  "submittedBy": "string",
  "team": "string",
  "playerName": "string",
  "playerPosition": "string",
  "playerHeadshotUrl": "string",
  "reason": "string",
  "intensity": "mild | full | eternal",
  "flavorText": "string",
  "nflWeek": 1,
  "timestamp": "ISO8601",
  "verdict": "pending | cast | null",
  "verdictTimestamp": "ISO8601 | null"
}
```

---

## 8. Witch's Verdict — Functionality

### 8.1 Overview

The designated "Curse Witch" friend can mark any submitted curse as **Cast ✅** or **Pending 🕯️** directly from the Hex Board. Access to verdict controls is protected by a password, set by the Witch at build time and baked into the app as a secure hash. No backend is required.

### 8.2 Password Security Model

The Witch's password is never stored in plain text anywhere in the codebase or at runtime.

**At build time:**
- The Witch chooses a password and sets it as a GitHub Actions secret: `WITCH_PASSWORD`
- The build script runs `bcrypt.hash(process.env.WITCH_PASSWORD, 12)` and writes the resulting hash as a JS constant into the built output (e.g. inlined into `app.js` as `const WITCH_HASH = "<hash>"`)
- The raw password never appears in source control, build logs, or the deployed files

**At runtime:**
- When the Witch attempts to enter verdict mode, the app uses `bcrypt.compare(enteredPassword, WITCH_HASH)` entirely in the browser via the `bcryptjs` library (loaded from CDN)
- The plain-text password is never stored in `localStorage`, `sessionStorage`, cookies, or any JS variable that persists beyond the authentication check
- The verified session is held only in a short-lived in-memory JS variable (`witchModeActive = true`) that resets on page refresh — the Witch must re-authenticate each session

> **Security note:** Because this is a static site, the bcrypt hash is technically visible in the deployed JS source. This is acceptable for a private friend-group site — bcrypt with cost factor 12 makes brute-forcing the hash computationally expensive. The password itself remains secure as long as it isn't guessable. The Witch should choose a password that is not a dictionary word.

### 8.3 Triggering Verdict Mode

- A **secret gesture** activates the password prompt: clicking the main title **"THE NFL HEX ZONE"** three times in quick succession
- Alternatively, appending `?witch=true` to the URL triggers the password prompt on page load (useful for bookmarking)
- Either trigger opens the **Witch Mode Password Popup** (see Section 8.4)

### 8.4 Witch Mode Password Popup

A modal dialog overlays the page with the following:

- Title: *"🧙‍♀️ Identify Yourself, Witch"*
- A single password input field (type `password`; placeholder: *"Enter the incantation..."*)
- A **"Enter the Circle 🔮"** confirm button
- A **"Begone"** cancel/dismiss button
- An attempt counter display: *"Attempts remaining: 3"* — decrements visibly on each failed attempt

**On correct password:**
- Modal closes with a brief flash animation
- Witch Mode activates: a glowing purple border appears around the page and a top banner reads *"🧙‍♀️ Witch Mode Active — Your power is absolute"*
- Verdict controls become visible on all curse cards (see Section 8.5)

**On incorrect password:**
- The input field shakes with a CSS wiggle animation
- Attempt counter decrements
- Error message appears beneath the input: *"The spirits reject you."*
- On the 3rd failed attempt: modal closes, all entry points to Witch Mode are disabled for the remainder of the page session (until refresh), and a final message reads: *"🚫 Too many failed attempts. The coven is watching."*

**Lockout behavior:**
- After 3 failed attempts, the triple-click gesture and `?witch=true` URL param both silently no-op for the rest of the session
- No lockout state is persisted to `localStorage` — a page refresh resets the attempt counter

### 8.5 Verdict Controls

Once authenticated, each curse card gains two buttons:

| Button | Action |
|---|---|
| **✅ Cast It** | Marks the curse as Cast; records a `verdictTimestamp`; card badge updates immediately |
| **🕯️ Pending** | Marks the curse as Pending (default for all new curses) |

Clicking **✅ Cast It** triggers a brief celebratory animation on that card (sparkling stars ✨ for ~1 second).

### 8.6 Verdict Display

- All curse cards in the Hex Board display a small verdict badge:
  - No verdict: no badge shown
  - Pending: amber 🕯️ badge
  - Cast: green ✅ badge
- The **Witch's Verdict Feed** (Section 3.5) shows only cards with a non-null verdict, in a timeline view

### 8.7 Build Configuration

The project must include:

1. A `build.js` (or equivalent) script that:
   - Reads `process.env.WITCH_PASSWORD`
   - Hashes it with `bcryptjs` at cost factor 12
   - Inlines the resulting hash into the output JS as `const WITCH_HASH = "..."`
   - Fails the build with an explicit error if `WITCH_PASSWORD` is not set

2. A `.env.example` file in the repo (never a real `.env`) documenting the required variable:
   ```
   WITCH_PASSWORD=your_secret_password_here
   ```

3. A GitHub Actions workflow (`.github/workflows/deploy.yml`) that:
   - Pulls `WITCH_PASSWORD` from GitHub Actions Secrets
   - Runs the build script before deploying to GitHub Pages
   - Never echoes or logs the password value

4. `.gitignore` must include `.env`

---

## 9. Curse History by Week — Functionality

### 9.1 Overview

Every curse is tagged with an NFL week number at submission time. The Cursed Archives section organizes all submitted curses into collapsible week buckets so friends can browse curses by when they were submitted relative to the season.

### 9.2 Auto-Detection of Current NFL Week

The current week is calculated client-side using a hardcoded regular season start date (e.g. `2025-09-04` for the 2025 season). Logic:

```
currentWeek = floor((today - seasonStart) / 7) + 1
```

This value is clamped to the range [1, 18] during the regular season. Weeks 19–22 cover postseason (Wild Card, Divisional, Championship, Super Bowl). The hardcoded start date should be updated each season by editing a single constant in the JS source.

### 9.3 Week Bucket Behavior

- Each week with at least one curse gets its own collapsible bucket
- Current week bucket is expanded by default on page load; all others are collapsed
- Each bucket header displays: week number, date range (e.g. *"Sep 4 – Sep 10"*), and curse count badge
- Buckets are sorted in descending order (most recent week first)
- Within a bucket, cards are sorted newest-first by submission timestamp

### 9.4 Week Filter / Jump Navigation

- A horizontal row of week number pills above the buckets allows jumping to any week that has curses
- Active/selected week pill is highlighted
- Selecting a pill scrolls to and expands the corresponding bucket

### 9.5 Postseason Labels

Weeks 19–22 display friendly postseason labels instead of week numbers:

| Week Number | Label |
|---|---|
| 19 | Wild Card Weekend |
| 20 | Divisional Round |
| 21 | Championship Weekend |
| 22 | Super Bowl |

---

## 10. Witch Theme & Tone

The aesthetic is **chaotic and funny** — think less Halloween store, more unhinged football fan who happens to own a cauldron. Key tone guidelines:

- Placeholder text should be sarcastic and relatable (e.g. *"He lost me $20 on a parlay"*)
- Curse flavor texts lean into petty, specific, football-brained misfortune
- Section headers and labels use witch/hex vocabulary ("Cast", "Hex Board", "Cursed", "The Condemned")
- Color palette: dark backgrounds, glowing purple accents, gold highlights
- Fonts: spooky display font for titles, handwritten font for accents, readable font for body text

---

## 11. Out of Scope

- User accounts or authentication
- Backend or database of any kind
- External notifications (SMS, email, Discord)
- Mobile app version

---

## 12. Future Enhancements (Nice to Have)

- 🗳️ **Curse voting** — friends upvote which curse should be cast next
- 📊 **Most-hexed player leaderboard** — live tally of who's been requested most
- 🎲 **Random Hex button** — picks a random team + player if the user can't decide
- 🔔 **Web Push Notifications** — browser-native alerts, no backend needed