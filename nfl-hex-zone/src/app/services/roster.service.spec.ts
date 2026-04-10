import { TestBed } from '@angular/core/testing';
import { RosterService } from './roster.service';

describe('RosterService', () => {
  let service: RosterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RosterService);
  });

  it('should expose 32 teams sorted A–Z with unique espnIds', () => {
    const teams = service.teams;
    expect(teams.length).toBe(32);
    const names = teams.map((t) => t.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
    const ids = new Set(teams.map((t) => t.espnId));
    expect(ids.size).toBe(32);
  });

  it("getPlayersForTeam('kc') should return Chiefs players", () => {
    const players = service.getPlayersForTeam('kc');
    expect(players.length).toBeGreaterThan(0);
    expect(players.every((p) => p.name && p.position && p.espnId)).toBeTrue();
  });

  it("getPlayersForTeam('zzz') should return []", () => {
    expect(service.getPlayersForTeam('zzz')).toEqual([]);
  });
});
