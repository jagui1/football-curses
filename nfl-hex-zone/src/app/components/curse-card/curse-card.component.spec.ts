import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../auth/auth.service';
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
      providers: [
        {
          provide: AuthService,
          useValue: { witchModeActive: signal(false) } as unknown as AuthService,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CurseCardComponent);
    fixture.componentInstance.curse = base;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
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

  it('should not show a verdict badge when verdict is null', () => {
    fixture.componentInstance.curse = { ...base, verdict: null };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.verdict')).toBeNull();
  });

  it('should show rejected verdict badge with verdict--rejected class', () => {
    fixture.componentInstance.curse = {
      ...base,
      verdict: 'rejected',
      verdictTimestamp: new Date().toISOString(),
    };
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.verdict--rejected'),
    ).toBeTruthy();
  });

  it('should apply feed cast pulse class only for feed + cast verdict (3.6)', () => {
    fixture.componentInstance.variant = 'feed';
    fixture.componentInstance.curse = {
      ...base,
      verdict: 'cast',
      verdictTimestamp: new Date().toISOString(),
    };
    fixture.detectChanges();
    const article = fixture.nativeElement.querySelector('article');
    expect(article?.classList.contains('curse-card--feed-pulse-cast')).toBeTrue();
    expect(article?.classList.contains('curse-card--feed-pulse-rejected')).toBeFalse();
  });

  it('should apply feed rejected pulse class only for feed + rejected (3.6)', () => {
    fixture.componentInstance.variant = 'feed';
    fixture.componentInstance.curse = {
      ...base,
      verdict: 'rejected',
      verdictTimestamp: new Date().toISOString(),
    };
    fixture.detectChanges();
    const article = fixture.nativeElement.querySelector('article');
    expect(article?.classList.contains('curse-card--feed-pulse-rejected')).toBeTrue();
    expect(article?.classList.contains('curse-card--feed-pulse-cast')).toBeFalse();
  });

  it('should not apply feed pulse classes for pending verdict in feed (3.6)', () => {
    fixture.componentInstance.variant = 'feed';
    fixture.componentInstance.curse = {
      ...base,
      verdict: 'pending',
      verdictTimestamp: new Date().toISOString(),
    };
    fixture.detectChanges();
    const article = fixture.nativeElement.querySelector('article');
    expect(article?.classList.contains('curse-card--feed-pulse-cast')).toBeFalse();
    expect(article?.classList.contains('curse-card--feed-pulse-rejected')).toBeFalse();
  });

  it('should not apply feed pulse on hex board variant even when cast', () => {
    fixture.componentInstance.variant = 'board';
    fixture.componentInstance.curse = {
      ...base,
      verdict: 'cast',
      verdictTimestamp: new Date().toISOString(),
    };
    fixture.detectChanges();
    const article = fixture.nativeElement.querySelector('article');
    expect(article?.classList.contains('curse-card--feed-pulse-cast')).toBeFalse();
  });

  it('should not render witch verdict controls without witch mode', () => {
    expect(fixture.nativeElement.querySelector('.verdict-actions')).toBeNull();
  });

  it('should render verdict controls on board when witch mode is active', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CurseCardComponent],
      providers: [
        {
          provide: AuthService,
          useValue: { witchModeActive: signal(true) } as unknown as AuthService,
        },
      ],
    }).compileComponents();
    const f = TestBed.createComponent(CurseCardComponent);
    f.componentInstance.curse = base;
    f.componentInstance.variant = 'board';
    f.detectChanges();
    expect(f.nativeElement.querySelector('.verdict-actions')).toBeTruthy();
  });

  it('should not render verdict controls in archive variant even in witch mode', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CurseCardComponent],
      providers: [
        {
          provide: AuthService,
          useValue: { witchModeActive: signal(true) } as unknown as AuthService,
        },
      ],
    }).compileComponents();
    const f = TestBed.createComponent(CurseCardComponent);
    f.componentInstance.curse = base;
    f.componentInstance.variant = 'archive';
    f.detectChanges();
    expect(f.nativeElement.querySelector('.verdict-actions')).toBeNull();
  });

  it('should not render verdict controls in feed variant even in witch mode', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CurseCardComponent],
      providers: [
        {
          provide: AuthService,
          useValue: { witchModeActive: signal(true) } as unknown as AuthService,
        },
      ],
    }).compileComponents();
    const f = TestBed.createComponent(CurseCardComponent);
    f.componentInstance.curse = base;
    f.componentInstance.variant = 'feed';
    f.detectChanges();
    expect(f.nativeElement.querySelector('.verdict-actions')).toBeNull();
  });

  it('should swap headshot for position fallback emoji on image error', () => {
    const img = fixture.nativeElement.querySelector(
      '.headshot',
    ) as HTMLImageElement | null;
    expect(img).toBeTruthy();
    img!.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.headshot')).toBeNull();
    const fallback = fixture.nativeElement.querySelector('.headshot-fallback');
    expect(fallback?.textContent?.trim()).toBe('🎯');
  });
});
