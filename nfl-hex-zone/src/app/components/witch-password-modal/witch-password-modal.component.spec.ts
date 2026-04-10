import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { WitchPasswordModalComponent } from './witch-password-modal.component';

describe('WitchPasswordModalComponent', () => {
  let fixture: ComponentFixture<WitchPasswordModalComponent>;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [WitchPasswordModalComponent, FormsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(WitchPasswordModalComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show attempts remaining 2 after one failed verify', async () => {
    const auth = TestBed.inject(AuthService);
    await auth.verifyWitch('wrong-password');
    fixture.detectChanges();
    const t = fixture.nativeElement.textContent ?? '';
    expect(t).toContain('Attempts remaining: 2');
  });

  it('should render dialog title and primary actions', () => {
    const html = fixture.nativeElement.innerHTML;
    expect(html).toContain('Identify Yourself');
    expect(fixture.nativeElement.querySelector('.btn--primary')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.btn--ghost')).toBeTruthy();
  });
});
