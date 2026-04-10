import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HexBoardComponent } from './hex-board.component';
import { CurseStoreService } from '../../services/curse-store.service';

describe('HexBoardComponent', () => {
  let fixture: ComponentFixture<HexBoardComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HexBoardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HexBoardComponent);
    fixture.detectChanges();
  });

  it('should show empty state when no curses', () => {
    const text = fixture.nativeElement.textContent ?? '';
    expect(text).toContain('No hexes cast yet');
  });

  it('should emit requestClearAll when clear button is clicked', () => {
    const spy = jasmine.createSpy('requestClearAll');
    fixture.componentInstance.requestClearAll.subscribe(spy);
    (
      fixture.nativeElement.querySelector('.clear-stub') as HTMLButtonElement
    ).click();
    expect(spy).toHaveBeenCalled();
  });

  it('should list curses from store', () => {
    const store = TestBed.inject(CurseStoreService);
    store.add({
      id: 'c1',
      submitterName: 'a',
      team: 'Team',
      teamEspnId: 'kc',
      playerName: 'P',
      playerEspnId: '123',
      reason: 'why',
      intensity: 'MILD_JINX',
      curseFlavor: 'flav',
      timestamp: new Date().toISOString(),
      nflWeek: 2,
      verdict: null,
      verdictTimestamp: null,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-curse-card')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('No hexes cast yet');
  });
});
