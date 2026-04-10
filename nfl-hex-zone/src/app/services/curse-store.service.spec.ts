import { TestBed } from '@angular/core/testing';
import { CurseStoreService } from './curse-store.service';
import { CurseRecord } from '../models/curse-record.model';

function sampleRecord(id: string): CurseRecord {
  return {
    id,
    submitterName: 'Witch',
    team: 'Team',
    teamEspnId: 'kc',
    playerName: 'Player',
    playerEspnId: '1',
    reason: 'Because',
    intensity: 'FULL_HEX',
    curseFlavor: 'Flavor',
    timestamp: new Date().toISOString(),
    nflWeek: 1,
    verdict: null,
    verdictTimestamp: null,
  };
}

describe('CurseStoreService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('add should prepend and persist', () => {
    const s = TestBed.inject(CurseStoreService);
    const a = sampleRecord('a');
    const b = sampleRecord('b');
    s.add(a);
    expect(s.lastAddedCurseId()).toBe('a');
    s.add(b);
    expect(s.curses().map((c) => c.id)).toEqual(['b', 'a']);
    expect(s.lastAddedCurseId()).toBe('b');
    const raw = localStorage.getItem('hexzone_curses');
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).length).toBe(2);
  });

  it('should clear lastAddedCurseId after a short delay', (done) => {
    const s = TestBed.inject(CurseStoreService);
    s.add(sampleRecord('fade'));
    expect(s.lastAddedCurseId()).toBe('fade');
    setTimeout(() => {
      expect(s.lastAddedCurseId()).toBeNull();
      done();
    }, 600);
  });

  it('clear should empty signal and remove key', () => {
    const s = TestBed.inject(CurseStoreService);
    s.add(sampleRecord('x'));
    s.clear();
    expect(s.curses()).toEqual([]);
    expect(localStorage.getItem('hexzone_curses')).toBeNull();
  });

  it('updateVerdict should update one record', () => {
    const s = TestBed.inject(CurseStoreService);
    const r1 = sampleRecord('r1');
    const r2 = sampleRecord('r2');
    s.add(r1);
    s.add(r2);
    s.updateVerdict('r1', 'cast');
    const cur = s.curses();
    const one = cur.find((c) => c.id === 'r1')!;
    const two = cur.find((c) => c.id === 'r2')!;
    expect(one.verdict).toBe('cast');
    expect(one.verdictTimestamp).toBeTruthy();
    expect(two.verdict).toBeNull();
  });

  it('updateVerdict with unknown id should no-op', () => {
    const s = TestBed.inject(CurseStoreService);
    s.add(sampleRecord('only'));
    const before = JSON.stringify(s.curses());
    s.updateVerdict('nope', 'cast');
    expect(JSON.stringify(s.curses())).toBe(before);
  });

  it('should load [] on malformed localStorage', () => {
    localStorage.setItem('hexzone_curses', 'not-json');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const s = TestBed.inject(CurseStoreService);
    expect(s.curses()).toEqual([]);
  });

  it('should load [] on null string', () => {
    localStorage.setItem('hexzone_curses', 'null');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const s = TestBed.inject(CurseStoreService);
    expect(s.curses()).toEqual([]);
  });
});
