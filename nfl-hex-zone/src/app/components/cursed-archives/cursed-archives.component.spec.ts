import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CursedArchivesComponent } from './cursed-archives.component';
import { CurseStoreService } from '../../services/curse-store.service';

describe('CursedArchivesComponent', () => {
  let fixture: ComponentFixture<CursedArchivesComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CursedArchivesComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CursedArchivesComponent);
    fixture.detectChanges();
  });

  it('should show empty message when no curses', () => {
    expect(fixture.nativeElement.textContent).toContain('No curses archived');
  });

  it('should group curses by nflWeek and show bucket headers', () => {
    const store = TestBed.inject(CurseStoreService);
    store.add({
      id: 'a',
      submitterName: 's',
      team: 'T',
      teamEspnId: 'kc',
      playerName: 'P',
      playerEspnId: '1',
      reason: 'r',
      intensity: 'FULL_HEX',
      curseFlavor: 'f',
      timestamp: new Date().toISOString(),
      nflWeek: 5,
      verdict: null,
      verdictTimestamp: null,
    });
    store.add({
      id: 'b',
      submitterName: 's',
      team: 'T',
      teamEspnId: 'kc',
      playerName: 'Q',
      playerEspnId: '2',
      reason: 'r2',
      intensity: 'FULL_HEX',
      curseFlavor: 'f2',
      timestamp: new Date().toISOString(),
      nflWeek: 7,
      verdict: null,
      verdictTimestamp: null,
    });
    fixture.detectChanges();
    const t = fixture.nativeElement.textContent ?? '';
    expect(t).toContain('Week 5');
    expect(t).toContain('Week 7');
    expect(fixture.nativeElement.querySelectorAll('.week-pill').length).toBe(2);
    expect(fixture.nativeElement.querySelector('#archive-bucket-5')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#archive-bucket-7')).toBeTruthy();
  });
});
