# 🧙‍♀️ NFL Hex Zone — Feature TODO List

Each phase produces a fully working, shippable app before the next phase begins. Complete all items in a phase before advancing. Acceptance criteria define the exact conditions that must be true before a checkbox is marked done.

---

## Phase 1 — Foundation
> Scaffold, data models, global styles, and static component shells. No logic or interactivity. The goal is a running app with the correct structure and visual theme in place so all future work has somewhere to land.

---

- [x] **1.1 — Angular project scaffold**
  - Run `ng new nfl-hex-zone --routing=false --style=css --standalone`
  - Install dependencies: `npm install bcryptjs && npm install -D @types/bcryptjs`
  - **Acceptance criteria:**
    - `ng serve` starts without errors and opens at `localhost:4200`
    - `bcryptjs` and `@types/bcryptjs` appear in `package.json`
    - All folders exist: `src/app/models/`, `src/app/data/`, `src/app/services/`, `src/app/components/`, `src/app/auth/`, `scripts/`

---

- [x] **1.2 — TypeScript models**
  - Create `models/player.model.ts` — `Player` interface with `name: string`, `position: string`, `espnId: string`
  - Create `models/team.model.ts` — `Team` interface with `name`, `espnId`, `logoUrl`, `players: Player[]`
  - Create `models/curse-record.model.ts` — `CurseIntensity` type (`'MILD_JINX' | 'FULL_HEX' | 'ETERNAL_DAMNATION'`) and `CurseRecord` interface with all fields: `id`, `submitterName`, `team`, `teamEspnId`, `playerName`, `playerEspnId`, `reason`, `intensity`, `curseFlavor`, `timestamp`, `nflWeek`, `verdict`, `verdictTimestamp`
  - **Acceptance criteria:**
    - All three files compile with zero TypeScript errors
    - `verdict` field is typed as `'pending' | 'cast' | 'rejected' | null`
    - `nflWeek` is typed as `number`
    - `verdictTimestamp` is typed as `string | null`
    - Importing any model into another file produces no errors

---

- [x] **1.3 — Roster generation script and data files**
  - Create `scripts/generate-rosters.mjs` using the ESPN public API (tech spec Section 15)
  - Run it to generate `src/app/data/rosters.data.ts`
  - Create `src/app/data/curses.data.ts` exporting `CURSE_FLAVORS: string[]`
  - **Acceptance criteria:**
    - `rosters.data.ts` exports `ROSTERS: Team[]` containing exactly 32 teams
    - Every team object has a valid `espnId`, `logoUrl` in the ESPN CDN format, and at least 20 players
    - Every player object has a non-empty `name`, `position`, and `espnId`
    - `curses.data.ts` exports an array of at least 30 unique flavor text strings
    - Both files compile without TypeScript errors
    - Running the script a second time overwrites the file without manual intervention

---

- [x] **1.4 — Global CSS design tokens**
  - In `styles.css`, define all CSS custom properties: `--bg: #0a0a0f`, `--surface: #12121a`, `--card: #1a1a28`, `--border: #2e2e4a`, `--accent: #c026d3`, `--accent2: #7c3aed`, `--glow: rgba(192,38,211,0.45)`, `--yellow: #fbbf24`, `--green: #22c55e`, `--red: #ef4444`, `--text: #e2e0ff`, `--muted: #8b8aaa`
  - Add font variables: `--font-display: 'Creepster', cursive`, `--font-accent: 'Permanent Marker', cursive`, `--font-body: 'Cabin', sans-serif`
  - Import all three fonts from Google Fonts in `src/index.html`
  - Set `body` background, text color, and default font from tokens
  - Apply custom witch cursor to `body`
  - **Acceptance criteria:**
    - The page background is `#0a0a0f` (near-black), not the Angular default white
    - Body text renders in `Cabin`; no fallback system fonts are visible on load
    - All three Google Fonts load in the Network tab (no 404s)
    - The mouse cursor changes to the custom witch cursor anywhere on the page
    - All 12 color tokens and 3 font tokens are defined under `:root` and are overridable by component styles

---

- [x] **1.5 — Global CSS keyframe animations**
  - Add all keyframes to `styles.css`: `floatUp`, `twinkle`, `slideInDown`, `wiggle`, `spinPop`
  - Add `@media (prefers-reduced-motion: reduce)` rule that sets `animation-duration: 0.01ms !important` on all elements
  - **Acceptance criteria:**
    - All five `@keyframes` blocks are present in `styles.css`
    - With `prefers-reduced-motion: reduce` forced in DevTools, all animation-driven elements are visually static
    - No animation CSS references colors or values outside the token system

---

- [x] **1.6 — Static component shells**
  - Generate all standalone components: `header`, `curse-form`, `image-select`, `hex-board`, `curse-card`, `hex-overlay`
  - Register and render all in `AppComponent` in order: header → curse-form → hex-board
  - Each component template shows a visible placeholder text only
  - **Acceptance criteria:**
    - `ng serve` builds with zero errors and zero warnings
    - The page renders five visually distinct placeholder sections stacked vertically
    - No component uses `NgModule`; all are standalone
    - Removing any single component from `AppComponent` does not break the build

---

## Phase 2 — Core Data Flow & Hex Board
> The submission form works end-to-end. Curses are saved to `localStorage`, survive a page refresh, and render correctly on the Hex Board. The app is fully usable before any visual polish or auth features are added.

---

- [x] **2.1 — `RosterService`**
  - Create `services/roster.service.ts` injected at root
  - Expose `teams: Team[]` sorted alphabetically by name
  - Implement `getPlayersForTeam(espnId: string): Player[]`
  - **Acceptance criteria:**
    - `teams` returns all 32 teams sorted A–Z with no duplicates
    - `getPlayersForTeam('kc')` returns the Kansas City Chiefs roster
    - `getPlayersForTeam('zzz')` returns an empty array without throwing
    - Service is injectable in any component with no additional providers configuration

---

- [x] **2.2 — `SeasonService`**
  - Create `services/season.service.ts` (or add to `RosterService`)
  - Export `SEASON_START = '2025-09-04'` as a named constant
  - Implement `getCurrentNflWeek(): number` using `floor((today - seasonStart) / 7) + 1`, clamped to 1–22
  - Expose `getWeekLabel(week: number): string` returning `'Wild Card Weekend'` / `'Divisional Round'` / `'Championship Weekend'` / `'Super Bowl'` for weeks 19–22, and `'Week N'` for weeks 1–18
  - **Acceptance criteria:**
    - On a date of `2025-09-04`, `getCurrentNflWeek()` returns `1`
    - On a date of `2025-09-11`, it returns `2`
    - On a date before `2025-09-04`, it returns `1` (clamped, not 0 or negative)
    - On a date after the Super Bowl window, it returns `22` (clamped, not 23+)
    - `getWeekLabel(19)` returns `'Wild Card Weekend'`
    - `getWeekLabel(5)` returns `'Week 5'`

---

- [x] **2.3 — `CurseStoreService`**
  - Create `services/curse-store.service.ts` injected at root
  - Use `signal<CurseRecord[]>` initialized by parsing `localStorage` key `hexzone_curses`
  - Implement `add(record: CurseRecord): void` — prepends to signal and writes to `localStorage`
  - Implement `clear(): void` — empties signal and removes `localStorage` key
  - Implement `updateVerdict(id: string, verdict: 'pending' | 'cast' | 'rejected'): void` — finds record by `id`, sets `verdict` and `verdictTimestamp: new Date().toISOString()`, updates signal and `localStorage`
  - **Acceptance criteria:**
    - After `add()`, `curses()` contains the new record at index 0 (newest first)
    - After page refresh, `curses()` is repopulated from `localStorage` with the same records
    - `clear()` results in `curses()` returning `[]` and `localStorage.getItem('hexzone_curses')` returning `null`
    - `updateVerdict(id, 'cast')` updates only the matching record's `verdict` and `verdictTimestamp`; all other records are unchanged
    - Calling `updateVerdict` with a non-existent `id` does not throw and does not mutate any record
    - Malformed `localStorage` data (e.g. `"null"` or invalid JSON) causes `load()` to return `[]` without throwing

---

- [x] **2.4 — `ImageSelectComponent`**
  - Implement `ControlValueAccessor` so the component works with Angular Reactive Forms
  - Accept `@Input() options: { label: string; imageUrl: string; value: string }[]` and `@Input() placeholder: string`
  - Render a trigger button showing the selected option's image and label, or the placeholder
  - Render a dropdown panel with one row per option (image + label)
  - Manage open/closed state with a `signal<boolean>`; close on outside click via `@HostListener('document:click')`
  - Keyboard support: `ArrowDown`/`ArrowUp` moves focus, `Enter` selects, `Escape` closes
  - ARIA: `role="combobox"` and `aria-expanded` on trigger; `role="listbox"` on panel; `role="option"` and `aria-selected` per option
  - **Acceptance criteria:**
    - Clicking the trigger opens the panel; clicking outside closes it
    - Selecting an option closes the panel and displays the selected label and image in the trigger
    - The parent Reactive Form control's value updates on selection without manual `detectChanges()`
    - The component can be reset externally (e.g. `form.reset()`) and returns to placeholder state
    - Keyboard-only operation: tab to trigger → Enter to open → arrows to navigate → Enter to select → Escape to close, all without mouse
    - No image breaking when `imageUrl` is an empty string (gracefully shows a blank or fallback)
    - `aria-expanded` reflects the current open/closed state on every toggle

---

- [x] **2.5 — `CurseFormComponent`**
  - Build Reactive Form with `FormBuilder`: fields `submitterName` (required), `team` (required), `player` (required, starts disabled), `reason` (required, maxLength 280), `intensity` (required, default `'FULL_HEX'`), `nflWeek` (required, range 1–22, defaults to `SeasonService.getCurrentNflWeek()`)
  - Wire team `ImageSelectComponent` — options from `RosterService.teams` with ESPN logo URLs
  - Wire player `ImageSelectComponent` — repopulates via `team.valueChanges`; re-enables when team is selected; resets when team changes
  - Display live character counter under the `reason` textarea (`N / 280`)
  - Style intensity as three radio button cards: 🌶️ Mild Jinx · 🔥 Full Hex · ☠️ ETERNAL DAMNATION
  - On invalid submit: call `markAllAsTouched()`; show per-field inline error messages
  - On valid submit: build `CurseRecord` with `id: crypto.randomUUID()`, random `curseFlavor` from `CURSE_FLAVORS`, `timestamp: new Date().toISOString()`, `verdict: null`, `verdictTimestamp: null`; call `CurseStoreService.add()`; emit `(hexCast)` output event; reset form to defaults
  - **Acceptance criteria:**
    - The player dropdown is disabled and shows *"Pick a team first 🧙"* until a team is selected
    - Selecting a new team clears the previously selected player and repopulates the player list
    - Submitting with any required field empty displays a visible inline error for each missing field and does not call `CurseStoreService.add()`
    - The character counter updates on every keystroke; the field shows an error state and blocks submission when reason exceeds 280 characters
    - A valid submission adds the curse to `CurseStoreService`, emits `hexCast`, and resets the form — the team and player dropdowns return to placeholder state
    - The `nflWeek` field defaults to the correct current week value from `SeasonService`
    - The submitted `CurseRecord` contains a non-empty `curseFlavor` string from `CURSE_FLAVORS`
    - The submitted `CurseRecord`'s `intensity` matches one of the three `CurseIntensity` enum values

---

- [x] **2.6 — `CurseCardComponent`**
  - Accept `@Input() curse: CurseRecord`
  - Display: team logo (ESPN CDN from `teamEspnId`), player headshot (ESPN CDN from `playerEspnId`), player name and position, submitter name, reason, intensity label, flavor text, human-readable timestamp
  - Headshot `(error)` handler: replace broken image with the correct position-group fallback emoji per the table in PRD Section 4
  - Verdict badge: no badge for `null`, amber 🕯️ for `'pending'`, green ✅ for `'cast'`, red ❌ for `'rejected'`
  - All decorative emoji: `aria-hidden="true"`; all `<img>` elements: descriptive `[alt]` bindings
  - **Acceptance criteria:**
    - All 12 fields render with correct data for a given `CurseRecord` input
    - Breaking the headshot URL in DevTools causes the correct fallback emoji to appear (test at least: QB → 🎯, WR → 🙌, K → 🦵)
    - A curse with `verdict: null` shows no badge; `'cast'` shows green ✅; `'rejected'` shows red ❌
    - The verdict badge color uses `--green`, `--yellow`, or `--red` tokens — not hardcoded hex values
    - All `<img>` elements have non-empty `alt` text

---

- [x] **2.7 — `HexBoardComponent`**
  - Read `curses` signal from `CurseStoreService`; render a `CurseCardComponent` per entry using `@for`
  - Sort newest-first (already guaranteed by `CurseStoreService.add()` prepending)
  - Show empty state: *"No hexes cast yet. The board is disturbingly clean."*
  - Add "🗑️ Clear All Hexes" button — non-functional stub (wire in Phase 4)
  - Responsive CSS grid: 1 column `< 600px`, 2 columns `600–900px`, 3 columns `> 900px`
  - **Acceptance criteria:**
    - Submitting a new curse causes it to appear at the top of the board without a page refresh
    - The empty-state message is shown when `curses()` is empty and hidden when at least one curse exists
    - At 400px viewport width the board is single-column; at 700px it is two-column; at 1000px it is three-column (verify in DevTools)
    - The "🗑️ Clear All Hexes" button is visible but clicking it does nothing yet (no crash, no deletion)

---

- [x] **2.8 — `HeaderComponent` Curse Counter**
  - Read `curses().length` from `CurseStoreService`
  - Display the count in a styled badge next to the site title
  - **Acceptance criteria:**
    - Counter shows `0` on first load with no saved curses
    - Counter increments by 1 immediately after each valid form submission without a page refresh
    - Counter persists correctly after a page refresh (reflects `localStorage` count)

---

- [x] **2.9 — `HexOverlayComponent`**
  - Accept `@Input() visible: boolean`
  - When `visible` is `true`, render a full-screen overlay with a centered spinning 🔮 using the `spinPop` keyframe
  - `AppComponent` sets `visible = true` on `(hexCast)` event, then `false` after 1500ms via `setTimeout`
  - **Acceptance criteria:**
    - Submitting a valid curse triggers the overlay immediately
    - The overlay auto-dismisses after exactly 1.5 seconds
    - The overlay does not appear on page load
    - The overlay blocks pointer events while visible (user cannot click through it)
    - With `prefers-reduced-motion` enabled, the spinner does not animate but the overlay still appears and dismisses

---

## Phase 3 — Visual Polish & Animations
> All animations and theme effects from PRD Section 6 are applied. The app looks and feels finished. No new functionality — only visual completeness.

---

- [x] **3.1 — Floating emoji background**
  - In `HeaderComponent.ngAfterViewInit`, programmatically create 15–20 `<span>` elements containing emojis from the set `🧙‍♀️ 🏈 💀 🪄 🔮 ☠️ 🏟️`
  - Each span gets randomized `left` (0–100%), `animation-delay` (0–8s), `animation-duration` (6–14s), and `font-size` (1–2.5rem)
  - Animate via the `floatUp` keyframe; append to a dedicated background container behind page content
  - Mark all spans `aria-hidden="true"`
  - **Acceptance criteria:**
    - At least 15 emoji floats are visible moving upward on page load
    - Each page load shows a different random arrangement (not identical every time)
    - Floating emojis are visually behind all page content (correct `z-index`)
    - No floating emoji is keyboard-focusable or read by a screen reader

---

- [x] **3.2 — Star field background**
  - In `HeaderComponent.ngAfterViewInit`, programmatically create 60–80 `<span>` star elements
  - Each star gets randomized `top`, `left`, and `animation-delay` (spread across 0–5s)
  - Animate via the `twinkle` keyframe
  - Mark all stars `aria-hidden="true"`
  - **Acceptance criteria:**
    - Stars are distributed across the full page background, not clustered
    - Stars twinkle at different phases (they do not all pulse in sync)
    - Stars are visually behind floating emoji and all page content
    - No star is keyboard-focusable

---

- [x] **3.3 — Form card glow and cauldron pulse**
  - Apply `box-shadow: 0 0 24px var(--glow)` to the form card container
  - Add a named `@keyframes cauldronPulse` animation that cycles the glow intensity; apply it continuously to the form card
  - **Acceptance criteria:**
    - The form card has a visible purple glow at all times
    - The glow visibly breathes/pulses in a slow continuous loop
    - The glow uses `var(--glow)` token — not a hardcoded color
    - With `prefers-reduced-motion` enabled, the glow is static (no pulse)

---

- [x] **3.4 — Intensity radio button wiggle**
  - Apply the `wiggle` keyframe animation to each intensity option on `:hover` and `:focus-within`
  - **Acceptance criteria:**
    - Hovering over any intensity option triggers a brief wiggle animation
    - The wiggle plays once on hover, not continuously
    - Focusing the radio via keyboard also triggers the wiggle
    - With `prefers-reduced-motion`, the wiggle does not play

---

- [x] **3.5 — Curse card entrance animation**
  - Apply the `slideInDown` keyframe to newly added `CurseCardComponent` instances, paired with a brief purple `box-shadow` glow flash
  - Cards rendered on page load (from `localStorage`) must NOT animate — only brand-new submissions animate
  - **Acceptance criteria:**
    - Submitting a curse causes the new card to slide in from above with a glow flash
    - Refreshing the page shows existing cards immediately with no animation
    - The animation completes within ~400ms and does not loop
    - With `prefers-reduced-motion`, new cards appear instantly with no slide

---

- [x] **3.6 — Verdict badge pulse keyframes**
  - Define `@keyframes castPulse` (green glow cycle) and `@keyframes rejectedPulse` (red glow cycle) in `styles.css`
  - Apply `castPulse` to Cast ✅ cards and `rejectedPulse` to Rejected ❌ cards when they first appear in the Witch's Verdict Feed (built in Phase 4)
  - **Acceptance criteria:**
    - Cast cards in the Verdict Feed have a visible green glow pulse on load; it settles after ~1 cycle
    - Rejected cards have a visible red glow pulse on load
    - Pending cards have no pulse
    - With `prefers-reduced-motion`, no pulse plays

---

- [x] **3.7 — Accessibility and responsive pass**
  - Verify all three grid breakpoints in browser DevTools
  - Confirm all form `<label>` elements are correctly linked to their inputs via `for`/`id`
  - Run a keyboard-only pass: Tab through all form fields, navigate both image dropdowns with arrow keys, submit the form with Enter
  - Confirm the custom cursor is visible across the whole page
  - **Acceptance criteria:**
    - At 400px, 700px, and 1100px viewport widths the layout matches the 1/2/3-column grid spec
    - Every form input is reachable and operable by keyboard alone
    - No focus indicator is hidden or overridden without a visible replacement
    - The custom cursor renders on all major browsers (Chrome, Firefox, Safari)

---

## Phase 4 — Witch Mode & Verdict System
> The Witch can authenticate, issue verdicts on curse cards, and the Witch's Verdict Feed displays all judged curses. Verdict state is persisted to `localStorage`.

---

- [x] **4.1 — Password hashing pre-build script**
  - Create `scripts/hash-passwords.mjs`
  - Read `WITCH_PASSWORD` and `ADMIN_PASSWORD` from `process.env`
  - Fail with a descriptive error if either variable is missing
  - Fail with a descriptive error if `WITCH_PASSWORD === ADMIN_PASSWORD`
  - Hash both with `bcryptjs` at cost factor 12
  - Write `src/app/auth/password-hashes.ts` exporting `WITCH_HASH: string` and `ADMIN_HASH: string`
  - Add `src/app/auth/password-hashes.ts` and `.env` to `.gitignore`
  - Create `.env.example` documenting both variables
  - **Acceptance criteria:**
    - Running the script with both env vars set generates a valid `password-hashes.ts` file with two exported string constants
    - Running the script with a missing `WITCH_PASSWORD` exits with a non-zero code and prints a clear error
    - Running the script with `WITCH_PASSWORD === ADMIN_PASSWORD` exits with a non-zero code and prints a clear error
    - `password-hashes.ts` is not tracked by git (confirmed via `git status`)
    - `.env` is not tracked by git
    - `.env.example` IS tracked by git and contains both variable names with placeholder values

---

- [x] **4.2 — `AuthService`**
  - Create `src/app/auth/auth.service.ts` provided at root
  - Import `WITCH_HASH` and `ADMIN_HASH` from `password-hashes.ts`
  - Expose signals: `witchModeActive`, `adminModeActive`, `witchLockout`, `adminLockout`, `witchAttempts`, `adminAttempts` — all typed and initialized to `false` or `0`
  - Implement `verifyWitch(password: string): Promise<boolean>` — increments `witchAttempts`; on success sets `witchModeActive(true)`; at 3 failures sets `witchLockout(true)`
  - Implement `verifyAdmin(password: string): Promise<boolean>` — same pattern for admin signals
  - **Acceptance criteria:**
    - `verifyWitch` with the correct password resolves `true` and `witchModeActive()` becomes `true`
    - `verifyWitch` with a wrong password resolves `false` and `witchModeActive()` stays `false`
    - After 3 failed `verifyWitch` calls, `witchLockout()` is `true` and subsequent calls resolve `false` without calling `bcrypt.compare` again
    - `witchLockout` is never written to `localStorage` (confirm via DevTools Application tab after 3 failures)
    - `adminModeActive` and `witchModeActive` are fully independent — setting one does not affect the other

---

- [x] **4.3 — Witch Mode trigger (triple-click and URL param)**
  - In `HeaderComponent`, track clicks on the site title; if 3 clicks occur within 600ms and `witchLockout()` is `false`, emit a `(triggerWitchModal)` output event
  - In `AppComponent`, listen for `(triggerWitchModal)` and open `WitchPasswordModalComponent`
  - On `AppComponent` init, read the `witch` query param; if `'true'` and not locked out, open the modal automatically
  - **Acceptance criteria:**
    - Triple-clicking the title within 600ms opens the password modal
    - Double-clicking or clicking slowly (> 600ms between clicks) does not open the modal
    - After 3 failed password attempts, triple-clicking the title does nothing (silently no-ops)
    - Loading the page with `?witch=true` in the URL opens the modal on load
    - Loading the page with `?witch=false` or no param does not open the modal

---

- [x] **4.4 — `WitchPasswordModalComponent`**
  - Render the modal only when triggered (use `@if` or `*ngIf`, not CSS `display: none`)
  - Template: title *"🧙‍♀️ Identify Yourself, Witch"*, password `<input type="password">`, *"Enter the Circle 🔮"* confirm button, *"Begone"* dismiss button, attempts-remaining counter derived from `AuthService.witchAttempts`
  - On incorrect password: apply `wiggle` CSS class to the input field; show error *"The spirits reject you."*; decrement displayed counter
  - On 3rd failure: close modal; show toast *"🚫 Too many failed attempts. The coven is watching."* for 3 seconds
  - On correct password: close modal with a brief purple flash animation; show persistent top banner *"🧙‍♀️ Witch Mode Active — Your power is absolute"*; apply glowing purple `outline` to the page `<body>`
  - **Acceptance criteria:**
    - Modal is not present in the DOM until triggered
    - The password input is auto-focused when the modal opens
    - Entering a wrong password shakes the input and shows the error message; the modal stays open
    - The attempts counter reads *"Attempts remaining: 2"* after one failure, *"Attempts remaining: 1"* after two
    - On correct password, `AuthService.witchModeActive()` is `true`, the modal is gone, and the active banner is visible
    - Clicking *"Begone"* closes the modal without triggering lockout or changing any auth state
    - The password input value is cleared on modal close regardless of success or failure

---

- [x] **4.5 — Verdict controls on `CurseCardComponent`**
  - Inject `AuthService` into `CurseCardComponent`
  - Render three verdict buttons only when `witchModeActive()` is `true`: **✅ Cast It**, **🕯️ Pending**, **❌ Reject**
  - **✅ Cast It**: calls `CurseStoreService.updateVerdict(curse.id, 'cast')`; triggers a ✨ sparkle CSS animation on the card for ~1 second
  - **🕯️ Pending**: calls `CurseStoreService.updateVerdict(curse.id, 'pending')`
  - **❌ Reject**: calls `CurseStoreService.updateVerdict(curse.id, 'rejected')`; triggers a 💥 red X flash animation for ~0.5 seconds
  - **Acceptance criteria:**
    - Verdict buttons are completely absent from the DOM when `witchModeActive()` is `false`
    - Clicking **✅ Cast It** immediately updates the card's badge to green ✅ without a page refresh
    - Clicking **❌ Reject** immediately updates the card's badge to red ❌ and triggers the red flash animation
    - Verdict changes persist after a page refresh (verify via `localStorage` in DevTools)
    - A curse can be re-judged: e.g. changing a verdict from `'cast'` to `'rejected'` works correctly and updates `verdictTimestamp`
    - Verdict buttons are not rendered inside the Witch's Verdict Feed (read-only in that section)

---

- [x] **4.6 — `WitchVerdictFeedComponent`**
  - Generate `components/witch-verdict-feed` as a standalone component
  - Add it as a fifth page section in `AppComponent`, below the Hex Board, labeled *"🔮 The Witch Has Spoken"*
  - Derive a `computed` signal of all curses where `verdict !== null`, sorted by `verdictTimestamp` descending
  - Render cards in a vertical CSS timeline layout (left border line with connecting dot per card)
  - Cast cards: green glow using `--green`; Pending cards: amber glow using `--yellow`; Rejected cards: red glow using `--red`
  - Apply `castPulse` / `rejectedPulse` animations on card load (from Phase 3.6)
  - Empty state: *"The cauldron is warming... patience, mortal."*
  - No verdict buttons rendered in this section under any auth state
  - **Acceptance criteria:**
    - Section is visible on the page and labeled correctly
    - Only curses with a non-null verdict appear here; un-judged curses do not
    - Cards are sorted by `verdictTimestamp` newest-first (most recently judged at top)
    - Cast, Pending, and Rejected cards each have the correct glow color
    - The empty state is shown when no verdicts have been issued and hidden once at least one exists
    - Verdict buttons are not rendered on any card in this section, even in Witch Mode
    - After issuing a verdict on a card in the Hex Board, the card appears in this feed within the same session without a page refresh

---

## Phase 5 — Admin Mode, Curse Archives & GitHub Deployment
> The Admin clear-all flow is protected. The Cursed Archives by-week view is built. GitHub Actions deploys the app to GitHub Pages with secrets injected at build time.

---

- [x] **5.1 — Admin Mode password modal**
  - Create `AdminPasswordModalComponent` (standalone)
  - Wire it to the "🗑️ Clear All Hexes" button in `HexBoardComponent` — clicking the button opens the modal; no deletion occurs yet
  - Template: title *"💀 This Cannot Be Undone"*, subtitle *"Enter the admin incantation to erase all hexes from existence."*, password `<input type="password">` (placeholder: *"The forbidden word..."*), *"Destroy Everything 🗑️"* button (red/crimson), *"Abort"* button, attempts-remaining counter
  - On incorrect password: shake input, show *"Access denied. The archive resists you."*, decrement counter
  - On 3rd failure: close modal; disable the "🗑️ Clear All Hexes" button for the rest of the session; show toast *"🚫 Too many failed attempts. The hexes are safe... for now."*
  - On correct password: do not delete yet — transition to the confirmation screen within the same modal (see item 5.2)
  - **Acceptance criteria:**
    - Clicking "🗑️ Clear All Hexes" opens the modal; no data is deleted at this point
    - Wrong password shakes the input and shows the error; modal stays open
    - After 3 failures, the modal closes and the "🗑️ Clear All Hexes" button is visually greyed-out and non-clickable for the session
    - The lockout is NOT persisted to `localStorage` — refreshing the page re-enables the button
    - Clicking *"Abort"* closes the modal without changing any data or auth state
    - The Admin modal is completely independent of the Witch modal — being in Witch Mode does not unlock or affect the Admin modal

---

- [x] **5.2 — Admin confirmation screen and clear execution**
  - After correct Admin password, replace the modal's password step with a final confirmation screen (no close/reopen — swap content within the same modal element)
  - Confirmation screen content: *"☠️ You are about to delete [N] curses. There is no coming back."* (N = live count from signal), *"Yes, Burn It All"* button, *"Wait, No"* button
  - *"Wait, No"* fully dismisses the modal without deleting anything
  - *"Yes, Burn It All"* calls `CurseStoreService.clear()`, closes the modal, plays the full-screen skull 💀 sweep animation for ~1 second, then shows toast *"The hex board has been cleansed. 💀"*
  - **Acceptance criteria:**
    - The confirmation screen shows the correct current curse count at the moment of display
    - Clicking *"Wait, No"* closes the modal and all curses remain intact (verify in DevTools `localStorage`)
    - Clicking *"Yes, Burn It All"* clears `localStorage`, the Hex Board renders empty, the Curse Counter resets to 0, and the skull animation plays
    - The skull animation plays for ~1 second and does not loop
    - After clearing, the Witch's Verdict Feed also renders empty
    - With `prefers-reduced-motion`, the skull animation is skipped but deletion still completes

---

- [x] **5.3 — `CursedArchivesComponent` — week bucket layout**
  - Generate `components/cursed-archives` as a standalone component
  - Add it as a fourth page section in `AppComponent`, between the Hex Board and the Witch's Verdict Feed, labeled *"📅 The Cursed Archives"*
  - Group curses from `CurseStoreService` by `nflWeek` using a `computed` signal
  - Render one collapsible bucket per week that has at least one curse
  - Bucket header: week label from `SeasonService.getWeekLabel()`, date range (e.g. *"Sep 4 – Sep 10"*), curse count badge
  - Sort buckets descending (most recent week first); sort cards within each bucket newest-first
  - Current week bucket is expanded by default; all others are collapsed
  - Apply a smooth CSS height transition on expand/collapse
  - **Acceptance criteria:**
    - Curses tagged with different `nflWeek` values appear in separate buckets
    - The current week's bucket is expanded on page load; all prior weeks are collapsed
    - Clicking a bucket header toggles it; the transition is smooth (not a jump)
    - Buckets are sorted with the highest week number at the top
    - Week 19 bucket header reads *"Wild Card Weekend"*; Week 5 reads *"Week 5"*
    - A week bucket disappears if all its curses are deleted (e.g. via Clear All)
    - Curses submitted without a manually overridden week default to the correct auto-detected week

---

- [x] **5.4 — `CursedArchivesComponent` — week filter pills**
  - Above the bucket list, render a horizontal row of week number pills — one pill per week that has at least one curse
  - Highlight the currently active/selected pill
  - Clicking a pill scrolls to and expands the corresponding bucket, and collapses all others
  - **Acceptance criteria:**
    - Only weeks with at least one curse show a pill (no empty-week pills)
    - Pills are sorted ascending left-to-right (Week 1 leftmost)
    - Clicking a pill smoothly scrolls the page to the target bucket and expands it
    - The clicked pill becomes visually highlighted (active state)
    - If a week's last curse is deleted, its pill disappears

---

- [x] **5.5 — GitHub Actions deployment workflow**
  - Update `.github/workflows/deploy.yml` to:
    - Check out code, set up Node 20, run `npm ci`
    - Run `node scripts/hash-passwords.mjs` with `WITCH_PASSWORD` and `ADMIN_PASSWORD` injected from GitHub Actions Secrets
    - Run `npx ng build --configuration production --base-href /nfl-hex-zone/`
    - Deploy `./dist/nfl-hex-zone/browser` to the `gh-pages` branch via `peaceiris/actions-gh-pages@v4`
  - Add `WITCH_PASSWORD` and `ADMIN_PASSWORD` to the repository's GitHub Actions Secrets
  - Enable GitHub Pages in repository Settings → Pages → source: `gh-pages` branch
  - **Acceptance criteria:**
    - Pushing to `main` triggers the workflow automatically
    - The workflow passes all steps without errors in the Actions tab
    - The deployed site is accessible at `https://<username>.github.io/nfl-hex-zone/`
    - Neither `WITCH_PASSWORD` nor `ADMIN_PASSWORD` appears in any workflow log (confirm in Actions → job logs)
    - The deployed `app.js` bundle does NOT contain the plaintext password — only the bcrypt hash (verify via browser DevTools → Sources → search for the password string)
    - The deployed app loads all 32 teams, accepts a curse submission, and persists it across a page refresh