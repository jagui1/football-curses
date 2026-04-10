import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CurseFormComponent } from './curse-form.component';
import { CurseStoreService } from '../../services/curse-store.service';

describe('CurseFormComponent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create with reactive form', async () => {
    await TestBed.configureTestingModule({
      imports: [CurseFormComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(CurseFormComponent);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('#submitterName')).toBeTruthy();
    expect(root.querySelector('#reason')).toBeTruthy();
    expect(root.querySelector('#nflWeek')).toBeTruthy();
    expect(root.querySelector('#team-label')).toBeTruthy();
    expect(root.querySelector('#player-label')).toBeTruthy();
    expect(cmp).toBeTruthy();
    expect(cmp.form.get('submitterName')).toBeTruthy();
    expect(cmp.form.get('team')).toBeTruthy();
    expect(cmp.form.get('player')).toBeTruthy();
    expect(cmp.form.get('reason')).toBeTruthy();
    expect(cmp.form.get('intensity')).toBeTruthy();
    expect(cmp.form.get('nflWeek')).toBeTruthy();
  });

  it('should not call store.add when invalid', async () => {
    await TestBed.configureTestingModule({
      imports: [CurseFormComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(CurseFormComponent);
    fixture.detectChanges();
    const store = TestBed.inject(CurseStoreService);
    spyOn(store, 'add');
    const btn = fixture.debugElement.query(By.css('button[type="submit"]'));
    btn.nativeElement.click();
    fixture.detectChanges();
    expect(store.add).not.toHaveBeenCalled();
  });
});
