import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurseCardComponent } from './curse-card.component';
import { CurseRecord } from '../../models/curse-record.model';

describe('CurseCardComponent', () => {
  let fixture: ComponentFixture<CurseCardComponent>;

  const base: CurseRecord = {
    id: 'id-1',
    submitterName: 'Sam',
    team: 'Kansas City Chiefs',
    teamEspnId: 'kc',
    playerName: 'Patrick Mahomes',
    playerEspnId: '3139477',
    reason: 'Test reason',
    intensity: 'FULL_HEX',
    curseFlavor: 'May his socks be damp.',
    timestamp: '2025-09-10T12:00:00.000Z',
    nflWeek: 2,
    verdict: null,
    verdictTimestamp: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurseCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CurseCardComponent);
    fixture.componentInstance.curse = base;
    fixture.detectChanges();
  });

  it('should render submitter and reason', () => {
    const t = fixture.nativeElement.textContent ?? '';
    expect(t).toContain('Sam');
    expect(t).toContain('Test reason');
    expect(t).toContain('May his socks be damp.');
  });

  it('should show cast verdict styling when verdict is cast', () => {
    fixture.componentInstance.curse = {
      ...base,
      verdict: 'cast',
      verdictTimestamp: new Date().toISOString(),
    };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.verdict--cast')).toBeTruthy();
  });
});
