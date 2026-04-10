import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AdminPasswordModalComponent } from './admin-password-modal.component';

describe('AdminPasswordModalComponent', () => {
  let fixture: ComponentFixture<AdminPasswordModalComponent>;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AdminPasswordModalComponent, FormsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminPasswordModalComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render password step title and danger button', () => {
    const html = fixture.nativeElement.innerHTML;
    expect(html).toContain('This Cannot Be Undone');
    expect(fixture.nativeElement.querySelector('.btn--danger')).toBeTruthy();
  });
});
