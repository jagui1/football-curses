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

The site is a **single page** with three visual sections stacked vertically.

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
- A **"🗑️ Clear All Hexes"** button with a confirmation step before deleting

---

## 4. Form Fields

| Field | Type | Details |
|---|---|---|
| **Your Name** | Text input | Who is submitting the request; placeholder: *"Your witch name"* |
| **Select Team** | Image dropdown | All 32 NFL teams with logos, sorted alphabetically by city |
| **Select Player** | Image dropdown | Populates automatically when a team is chosen; shows player headshot + name + position; defaults to *"Pick a team first 🧙"* |
| **Why do they deserve it?** | Textarea | Free text; placeholder: *"He dropped a wide-open pass and I lost $20"*; 280 character limit with live counter |
| **Curse Intensity** | Styled radio buttons | 🌶️ Mild Jinx · 🔥 Full Hex · ☠️ ETERNAL DAMNATION |

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

---

## 7. Data Persistence

All curse submissions are saved locally in the user's browser. Curses survive page refreshes and browser restarts. No account or login is required — anyone who opens the site on the same device can see and submit curses.

---

## 8. Witch Theme & Tone

The aesthetic is **chaotic and funny** — think less Halloween store, more unhinged football fan who happens to own a cauldron. Key tone guidelines:

- Placeholder text should be sarcastic and relatable (e.g. *"He lost me $20 on a parlay"*)
- Curse flavor texts lean into petty, specific, football-brained misfortune
- Section headers and labels use witch/hex vocabulary ("Cast", "Hex Board", "Cursed", "The Condemned")
- Color palette: dark backgrounds, glowing purple accents, gold highlights
- Fonts: spooky display font for titles, handwritten font for accents, readable font for body text

---

## 9. Out of Scope

- User accounts or authentication
- Backend or database of any kind
- External notifications (SMS, email, Discord)
- Admin panel for the Witch to manage requests
- Mobile app version

---

## 10. Future Enhancements (Nice to Have)

- 🗳️ **Curse voting** — friends upvote which curse should be cast next
- 📊 **Most-hexed player leaderboard** — live tally of who's been requested most
- 🎲 **Random Hex button** — picks a random team + player if the user can't decide
- 🔔 **Web Push Notifications** — browser-native alerts, no backend needed
- 🌙 **Witch's Verdict feed** — the friend manually marks curses as "Cast ✅" or "Pending 🕯️"
- 📅 **Curse history by NFL week** — organizes requests by game week
