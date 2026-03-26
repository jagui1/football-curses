# 🧙‍♀️ NFL Hex Zone — Technical Specification

---

## 1. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Angular 17+ (standalone components) | Structured, component-driven architecture; excellent TypeScript support; built-in form handling |
| Language | TypeScript 5+ | Full type safety across models, services, and components |
| Styling | CSS3 with Angular component encapsulation | Scoped styles per component; global theme via `styles.css` CSS custom properties |
| Fonts | Google Fonts CDN | Free; loads `Creepster`, `Permanent Marker`, and `Cabin` |
| Roster data | TypeScript data file (`rosters.data.ts`) | Type-safe; generated once via helper script; no runtime API calls needed |
| Persistence | Browser `localStorage` via an Angular service | Zero backend; survives page refresh; injectable and testable |
| Images | ESPN public CDN | Logo and headshot URLs served at no cost; no API key required |
| Build & deploy | Angular CLI + GitHub Actions | `ng build` outputs to `dist/`; Actions deploys to GitHub Pages automatically |

---

## 2. Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Angular CLI | `npm install -g @angular/cli` (v17+) |

---

## 3. Project Scaffold

```bash
ng new nfl-hex-zone --routing=false --style=css --standalone
cd nfl-hex-zone
```

---

## 4. File Structure

```
nfl-hex-zone/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deploy to Pages
├── src/
│   ├── index.html                  # App shell
│   ├── styles.css                  # Global CSS tokens + animations
│   ├── main.ts                     # Angular bootstrap
│   └── app/
│       ├── app.component.ts        # Root component
│       ├── app.component.html
│       ├── app.component.css
│       │
│       ├── models/
│       │   ├── curse-record.model.ts
│       │   ├── player.model.ts
│       │   └── team.model.ts
│       │
│       ├── data/
│       │   ├── rosters.data.ts     # All 32 teams + rosters (generated once)
│       │   └── curses.data.ts      # Funny curse flavor text array
│       │
│       ├── services/
│       │   ├── curse-store.service.ts    # localStorage read/write
│       │   └── roster.service.ts         # Team + player data access
│       │
│       └── components/
│           ├── header/
│           │   ├── header.component.ts
│           │   ├── header.component.html
│           │   └── header.component.css
│           ├── curse-form/
│           │   ├── curse-form.component.ts
│           │   ├── curse-form.component.html
│           │   └── curse-form.component.css
│           ├── image-select/           # Reusable image dropdown
│           │   ├── image-select.component.ts
│           │   ├── image-select.component.html
│           │   └── image-select.component.css
│           ├── hex-board/
│           │   ├── hex-board.component.ts
│           │   ├── hex-board.component.html
│           │   └── hex-board.component.css
│           ├── curse-card/
│           │   ├── curse-card.component.ts
│           │   ├── curse-card.component.html
│           │   └── curse-card.component.css
│           └── hex-overlay/
│               ├── hex-overlay.component.ts
│               ├── hex-overlay.component.html
│               └── hex-overlay.component.css
└── scripts/
    └── generate-rosters.mjs        # One-time Node script to build rosters.data.ts
```

---

## 5. TypeScript Models

### `models/player.model.ts`
```ts
export interface Player {
  name:     string;
  position: string;
  espnId:   string;
}
```

### `models/team.model.ts`
```ts
import { Player } from './player.model';

export interface Team {
  name:    string;
  espnId:  string;
  logoUrl: string;
  players: Player[];
}
```

### `models/curse-record.model.ts`
```ts
export type CurseIntensity = 'MILD_JINX' | 'FULL_HEX' | 'ETERNAL_DAMNATION';

export interface CurseRecord {
  id:            string;
  submitterName: string;
  team:          string;
  teamEspnId:    string;
  playerName:    string;
  playerEspnId:  string;
  reason:        string;
  intensity:     CurseIntensity;
  curseFlavor:   string;
  timestamp:     string;
}
```

---

## 6. Data Files

### `data/rosters.data.ts`
```ts
import { Team } from '../models/team.model';

export const ROSTERS: Team[] = [
  {
    name:    'Arizona Cardinals',
    espnId:  'ari',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
    players: [
      { name: 'Kyler Murray',        position: 'QB', espnId: '3917315' },
      { name: 'Marvin Harrison Jr.', position: 'WR', espnId: '4432577' },
      // ~50 more players
    ],
  },
  // all 32 teams...
];
```

### `data/curses.data.ts`
```ts
export const CURSE_FLAVORS: string[] = [
  'May his cleats always be slightly too tight.',
  'May he fumble every time his mom is watching.',
  'May his Madden rating drop by 3 every week.',
  'May his touchdown celebration get flagged for taunting.',
  'May he always be one yard short of a first down.',
  // 30–50 total entries
];
```

### ESPN CDN URL Patterns
```
Team logo:       https://a.espncdn.com/i/teamlogos/nfl/500/{espnId}.png
Player headshot: https://a.espncdn.com/i/headshots/nfl/players/full/{espnId}.png
```

### Image Fallback Strategy

If a headshot fails to load, an Angular `(error)` binding on `<img>` replaces `src` with a position-based emoji rendered as a text node:

| Position group | Fallback emoji |
|---|---|
| QB | 🎯 |
| RB / FB | 🏃 |
| WR / TE | 🙌 |
| OL (C/G/T) | 🧱 |
| DL (DE/DT/NT) | 💪 |
| LB | 🦾 |
| DB (CB/S) | 🛡️ |
| K / P / LS | 🦵 |

---

## 7. Services

### `services/roster.service.ts`
```ts
import { Injectable } from '@angular/core';
import { ROSTERS } from '../data/rosters.data';
import { Team } from '../models/team.model';
import { Player } from '../models/player.model';

@Injectable({ providedIn: 'root' })
export class RosterService {
  readonly teams: Team[] = [...ROSTERS].sort((a, b) => a.name.localeCompare(b.name));

  getPlayersForTeam(espnId: string): Player[] {
    return this.teams.find(t => t.espnId === espnId)?.players ?? [];
  }
}
```

### `services/curse-store.service.ts`
```ts
import { Injectable, signal } from '@angular/core';
import { CurseRecord } from '../models/curse-record.model';

const STORAGE_KEY = 'hexzone_curses';

@Injectable({ providedIn: 'root' })
export class CurseStoreService {
  private readonly _curses = signal<CurseRecord[]>(this.load());
  readonly curses = this._curses.asReadonly();

  add(record: CurseRecord): void {
    const updated = [record, ...this._curses()];
    this._curses.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  clear(): void {
    this._curses.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  private load(): CurseRecord[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
```

> Uses Angular 17 `signal()` so components reactively re-render when curses change — no manual change detection needed.

---

## 8. Component Responsibilities

### `AppComponent`
Root shell. Imports and composes `HeaderComponent`, `CurseFormComponent`, `HexBoardComponent`, and `HexOverlayComponent`.

### `HeaderComponent`
- Displays the site title and a randomly selected tagline (chosen in `ngOnInit`)
- Reads `curses().length` from `CurseStoreService` for the counter badge
- Spawns floating background emoji and star-field `<span>` elements in `ngAfterViewInit`

### `CurseFormComponent`
- Uses Angular **Reactive Forms** (`FormBuilder`, `FormGroup`, `Validators`)
- Contains two `ImageSelectComponent` instances: one for teams, one for players
- Listens to team field `valueChanges` to re-populate the player dropdown
- On valid submit: builds a `CurseRecord`, calls `CurseStoreService.add()`, emits a `hexCast` event to trigger the overlay, then resets the form

### `ImageSelectComponent` *(reusable)*
- Implements `ControlValueAccessor` so it works seamlessly with Reactive Forms
- `@Input() options`: array of `{ label: string; imageUrl: string; value: string }` objects
- Manages open/closed state with a boolean signal
- Closes on outside click via a `@HostListener('document:click')`
- Full keyboard support: `ArrowUp`, `ArrowDown`, `Enter`, `Escape`
- Emits selected value via `onChange` / `onTouched` callbacks

### `HexBoardComponent`
- Reads `curses` signal from `CurseStoreService`
- Renders a `CurseCardComponent` for each entry using `@for` (Angular 17 control flow)
- Contains the "🗑️ Clear All Hexes" button + confirmation dialog

### `CurseCardComponent`
- `@Input() curse: CurseRecord`
- Pure display component — renders all fields from the record
- Handles headshot `(error)` event to swap image for position emoji fallback

### `HexOverlayComponent`
- `@Input() visible: boolean` controls display
- CSS `spinPop` animation plays while visible
- Parent sets `visible = true` on form submit, then `false` after 1500ms

---

## 9. Reactive Form Structure (`CurseFormComponent`)

```ts
this.form = this.fb.group({
  submitterName: ['', Validators.required],
  team:          [null, Validators.required],
  player:        [{ value: null, disabled: true }, Validators.required],
  reason:        ['', [Validators.required, Validators.maxLength(280)]],
  intensity:     ['FULL_HEX', Validators.required],
});

// Enable player dropdown when a team is selected
this.form.get('team')!.valueChanges.subscribe(teamEspnId => {
  const playerCtrl = this.form.get('player')!;
  if (teamEspnId) {
    playerCtrl.enable();
    playerCtrl.reset();
    this.players = this.rosterService.getPlayersForTeam(teamEspnId);
  } else {
    playerCtrl.disable();
  }
});
```

---

## 10. Form Submission Flow

```
User clicks "Cast the Hex 🔮"
  │
  ├─ form.valid? No  → markAllAsTouched(); show inline validation errors
  │
  ├─ form.valid? Yes →
  │     Build CurseRecord {
  │       id:           Date.now().toString(),
  │       ...form.value,
  │       curseFlavor:  random pick from CURSE_FLAVORS,
  │       timestamp:    new Date().toISOString()
  │     }
  │
  ├─ CurseStoreService.add(record)       → updates signal + localStorage
  │
  ├─ HexOverlayComponent visible = true  → CSS animation plays (1500ms)
  │
  ├─ After 1500ms: visible = false
  │
  └─ form.reset()
```

---

## 11. CSS Design Tokens (`styles.css`)

```css
:root {
  /* Colors */
  --bg:       #0a0a0f;
  --surface:  #12121a;
  --card:     #1a1a28;
  --border:   #2e2e4a;
  --accent:   #c026d3;   /* witch purple */
  --accent2:  #7c3aed;   /* deep violet */
  --glow:     rgba(192, 38, 211, 0.45);
  --yellow:   #fbbf24;   /* spell-gold */
  --green:    #22c55e;   /* potion green */
  --text:     #e2e0ff;
  --muted:    #8b8aaa;

  /* Typography */
  --font-display: 'Creepster', cursive;        /* h1, site title */
  --font-accent:  'Permanent Marker', cursive;  /* labels, badges, buttons */
  --font-body:    'Cabin', sans-serif;          /* body text, form inputs */
}
```

Component-level styles use Angular's default `ViewEncapsulation.Emulated` so tokens from `styles.css` cascade in while component styles remain scoped.

---

## 12. Key CSS Animations (`styles.css`)

```css
@keyframes floatUp {
  0%   { transform: translateY(110vh) rotate(0deg);    opacity: 0; }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.4; }
  100% { transform: translateY(-10vh) rotate(360deg);  opacity: 0; }
}

@keyframes twinkle {
  from { opacity: 0.1; transform: scale(0.8); }
  to   { opacity: 0.9; transform: scale(1.2); }
}

@keyframes slideInDown {
  from { transform: translateY(-30px); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-8deg); }
  50%       { transform: rotate(8deg); }
}

@keyframes spinPop {
  0%   { transform: scale(0)   rotate(0deg);   opacity: 0; }
  40%  { transform: scale(1.4) rotate(180deg); opacity: 1; }
  70%  { transform: scale(1)   rotate(340deg); opacity: 1; }
  100% { transform: scale(0)   rotate(360deg); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; }
}
```

---

## 13. Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 600px` | Single column; form full width; curse cards stacked |
| `600–900px` | Form full width; curse cards in a 2-column grid |
| `> 900px` | Form centered at max 640px; curse cards in a 3-column grid |

---

## 14. Accessibility

- All form inputs use Angular's `[formControlName]` bound to a `<label>` via `for`/`id`
- `ImageSelectComponent` implements `role="combobox"`, `aria-expanded`, `aria-activedescendant`
- Each option has `role="option"` and `aria-selected`
- Keyboard navigable: `Tab`, `Enter`, `Escape`, `ArrowUp`, `ArrowDown`
- Decorative emoji use `aria-hidden="true"`
- All `<img>` elements have descriptive `[alt]` bindings
- All animations respect `prefers-reduced-motion`

---

## 15. Roster Generation Script (Run Once Locally)

```js
// scripts/generate-rosters.mjs — run with: node scripts/generate-rosters.mjs

import { writeFileSync } from 'fs';

const TEAMS = {
  ari: 'Arizona Cardinals', atl: 'Atlanta Falcons',  bal: 'Baltimore Ravens',
  buf: 'Buffalo Bills',     car: 'Carolina Panthers', chi: 'Chicago Bears',
  cin: 'Cincinnati Bengals',cle: 'Cleveland Browns',  dal: 'Dallas Cowboys',
  den: 'Denver Broncos',    det: 'Detroit Lions',     gb:  'Green Bay Packers',
  hou: 'Houston Texans',    ind: 'Indianapolis Colts',jax: 'Jacksonville Jaguars',
  kc:  'Kansas City Chiefs',lv:  'Las Vegas Raiders', lar: 'Los Angeles Rams',
  lac: 'Los Angeles Chargers', mia: 'Miami Dolphins', min: 'Minnesota Vikings',
  ne:  'New England Patriots', no:  'New Orleans Saints', nyg: 'New York Giants',
  nyj: 'New York Jets',     phi: 'Philadelphia Eagles', pit: 'Pittsburgh Steelers',
  sf:  'San Francisco 49ers',  sea: 'Seattle Seahawks',  tb:  'Tampa Bay Buccaneers',
  ten: 'Tennessee Titans',  wsh: 'Washington Commanders',
};

const teams = [];

for (const [slug, name] of Object.entries(TEAMS)) {
  const url  = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${slug}/roster`;
  const data = await fetch(url).then(r => r.json());

  const players = data.athletes
    .flatMap(group => group.items)
    .map(p => ({
      name:     p.fullName,
      position: p.position?.abbreviation ?? '?',
      espnId:   p.id,
    }));

  teams.push({
    name,
    espnId:  slug,
    logoUrl: `https://a.espncdn.com/i/teamlogos/nfl/500/${slug}.png`,
    players,
  });

  console.log(`✅  ${name} — ${players.length} players`);
}

const output = `import { Team } from '../models/team.model';\n\nexport const ROSTERS: Team[] = ${JSON.stringify(teams, null, 2)};\n`;
writeFileSync('src/app/data/rosters.data.ts', output);
console.log('✅  rosters.data.ts written!');
```

---

## 16. GitHub Actions Deploy (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      - run: npx ng build --configuration production --base-href /nfl-hex-zone/

      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/nfl-hex-zone/browser
```

> Replace `/nfl-hex-zone/` in `--base-href` with your actual repository name. After the first deploy, enable GitHub Pages in repository Settings → Pages → source: `gh-pages` branch.

---

## 17. Local Development

```bash
# Install dependencies
npm install

# Generate rosters (first time only — requires internet)
node scripts/generate-rosters.mjs

# Start dev server
ng serve

# Open in browser
# http://localhost:4200
```