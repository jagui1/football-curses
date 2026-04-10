import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { ImageSelectComponent, ImageSelectOption } from './image-select.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, ImageSelectComponent],
  template: `
    <app-image-select [formControl]="ctrl" [options]="options" placeholder="Pick" />
  `,
})
class HostComponent {
  ctrl = new FormControl<string | null>(null);
  options: ImageSelectOption[] = [
    { label: 'One', imageUrl: '', value: '1' },
    { label: 'Two', imageUrl: '', value: '2' },
  ];
}

describe('ImageSelectComponent (CVA)', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should bind FormControl value on selection', () => {
    const host = fixture.componentInstance;
    host.ctrl.setValue('2');
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('.trigger') as HTMLButtonElement;
    expect(trigger.textContent).toContain('Two');
  });

  it('should reset to placeholder when control reset', () => {
    const host = fixture.componentInstance;
    host.ctrl.setValue('1');
    fixture.detectChanges();
    host.ctrl.reset();
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('.trigger') as HTMLButtonElement;
    expect(trigger.textContent).toContain('Pick');
  });
});
