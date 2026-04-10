/**
 * Fetches NFL rosters from ESPN public API and writes src/app/data/rosters.data.ts
 * Run: node scripts/generate-rosters.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'src', 'app', 'data', 'rosters.data.ts');

const TEAMS = {
  ari: 'Arizona Cardinals',
  atl: 'Atlanta Falcons',
  bal: 'Baltimore Ravens',
  buf: 'Buffalo Bills',
  car: 'Carolina Panthers',
  chi: 'Chicago Bears',
  cin: 'Cincinnati Bengals',
  cle: 'Cleveland Browns',
  dal: 'Dallas Cowboys',
  den: 'Denver Broncos',
  det: 'Detroit Lions',
  gb: 'Green Bay Packers',
  hou: 'Houston Texans',
  ind: 'Indianapolis Colts',
  jax: 'Jacksonville Jaguars',
  kc: 'Kansas City Chiefs',
  lv: 'Las Vegas Raiders',
  lar: 'Los Angeles Rams',
  lac: 'Los Angeles Chargers',
  mia: 'Miami Dolphins',
  min: 'Minnesota Vikings',
  ne: 'New England Patriots',
  no: 'New Orleans Saints',
  nyg: 'New York Giants',
  nyj: 'New York Jets',
  phi: 'Philadelphia Eagles',
  pit: 'Pittsburgh Steelers',
  sf: 'San Francisco 49ers',
  sea: 'Seattle Seahawks',
  tb: 'Tampa Bay Buccaneers',
  ten: 'Tennessee Titans',
  wsh: 'Washington Commanders',
};

const teams = [];

for (const [slug, name] of Object.entries(TEAMS)) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${slug}/roster`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch roster for ${slug}: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();

  const athletes = data.athletes ?? [];
  const players = athletes.flatMap((group) =>
    (group.items ?? []).map((p) => ({
      name: p.fullName ?? '',
      position: p.position?.abbreviation ?? '?',
      espnId: String(p.id ?? ''),
    })),
  );

  teams.push({
    name,
    espnId: slug,
    logoUrl: `https://a.espncdn.com/i/teamlogos/nfl/500/${slug}.png`,
    players,
  });

  console.log(`✅  ${name} — ${players.length} players`);
}

mkdirSync(dirname(outPath), { recursive: true });
const output = `import { Team } from '../models/team.model';\n\nexport const ROSTERS: Team[] = ${JSON.stringify(teams, null, 2)};\n`;
writeFileSync(outPath, output, 'utf8');
console.log('✅  rosters.data.ts written!');
