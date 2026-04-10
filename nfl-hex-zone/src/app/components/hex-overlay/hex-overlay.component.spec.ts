import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HexOverlayComponent } from './hex-overlay.component';

describe('HexOverlayComponent', () => {
  let fixture: ComponentFixture<HexOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HexOverlayComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HexOverlayComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not render backdrop when hidden', () => {
    fixture.componentInstance.visible = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.backdrop')).toBeNull();
  });

  it('should render backdrop when visible', () => {
    fixture.componentInstance.visible = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.backdrop')).toBeTruthy();
  });
});
