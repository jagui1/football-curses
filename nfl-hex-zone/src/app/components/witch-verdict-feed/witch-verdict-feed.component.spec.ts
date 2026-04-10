import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WitchVerdictFeedComponent } from './witch-verdict-feed.component';
import { CurseStoreService } from '../../services/curse-store.service';

describe('WitchVerdictFeedComponent', () => {
  let fixture: ComponentFixture<WitchVerdictFeedComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [WitchVerdictFeedComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(WitchVerdictFeedComponent);
    fixture.detectChanges();
  });

  it('should show empty cauldron message when no verdicts', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'The cauldron is warming',
    );
  });

  it('should list curses that have a verdict', () => {
    const store = TestBed.inject(CurseStoreService);
    store.add({
      id: 'v1',
      submitterName: 'a',
      team: 'T',
      teamEspnId: 'kc',
      playerName: 'P',
      playerEspnId: '1',
      reason: 'r',
      intensity: 'FULL_HEX',
      curseFlavor: 'f',
      timestamp: new Date().toISOString(),
      nflWeek: 1,
      verdict: 'cast',
      verdictTimestamp: new Date().toISOString(),
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-curse-card')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.feed-timeline')).toBeTruthy();
  });
});
