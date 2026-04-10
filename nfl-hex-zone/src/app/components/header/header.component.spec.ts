import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CurseStoreService } from '../../services/curse-store.service';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('should show 0 hexes when store empty', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Hexes: 0');
  });

  it('should spawn background stars and emojis after view init', () => {
    const el = fixture.nativeElement as HTMLElement;
    const stars = el.querySelectorAll('.header-star');
    const emojis = el.querySelectorAll('.header-float-emoji');
    expect(stars.length).toBeGreaterThanOrEqual(60);
    expect(stars.length).toBeLessThanOrEqual(80);
    expect(emojis.length).toBeGreaterThanOrEqual(15);
    expect(emojis.length).toBeLessThanOrEqual(20);
  });

  it('should increment when a curse is added', () => {
    const store = TestBed.inject(CurseStoreService);
    store.add({
      id: '1',
      submitterName: 'a',
      team: 't',
      teamEspnId: 'kc',
      playerName: 'p',
      playerEspnId: 'x',
      reason: 'r',
      intensity: 'FULL_HEX',
      curseFlavor: 'f',
      timestamp: new Date().toISOString(),
      nflWeek: 1,
      verdict: null,
      verdictTimestamp: null,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Hexes: 1');
  });
});
