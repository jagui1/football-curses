import {
  Component,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type ImageSelectOption = { label: string; imageUrl: string; value: string };

@Component({
  selector: 'app-image-select',
  imports: [],
  templateUrl: './image-select.component.html',
  styleUrl: './image-select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageSelectComponent),
      multi: true,
    },
  ],
})
export class ImageSelectComponent implements ControlValueAccessor {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly listboxId = `imglist-${Math.random().toString(36).slice(2, 11)}`;
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panelRef');

  @Input({ required: true }) options: ImageSelectOption[] = [];
  @Input() placeholder = 'Select…';
  /** Optional id of an element that labels this combobox (e.g. visible `<label>` or `span`). */
  @Input() labelledBy?: string;

  protected readonly open = signal(false);
  protected readonly activeIndex = signal(0);

  private value: string | null = null;
  private disabled = false;

  private onChange: (v: string | null) => void = () => undefined;
  private onTouchedCb: () => void = () => undefined;

  writeValue(obj: string | null): void {
    this.value = obj;
  }

  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCb = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected selected(): ImageSelectOption | undefined {
    return this.options.find((o) => o.value === this.value);
  }

  protected toggle(ev: MouseEvent): void {
    ev.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.open.update((o) => !o);
    if (this.open()) {
      const idx = Math.max(
        0,
        this.options.findIndex((o) => o.value === this.value),
      );
      this.activeIndex.set(idx === -1 ? 0 : idx);
      setTimeout(() => this.panelRef()?.nativeElement.focus(), 0);
    }
  }

  protected select(opt: ImageSelectOption, ev?: Event): void {
    ev?.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.value = opt.value;
    this.onChange(this.value);
    this.open.set(false);
    this.onTouchedCb();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(ev: MouseEvent): void {
    if (!this.open()) {
      return;
    }
    if (this.host.nativeElement.contains(ev.target as Node)) {
      return;
    }
    this.open.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  protected onDocumentKeydown(ev: KeyboardEvent): void {
    if (!this.open()) {
      return;
    }
    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.open.set(false);
      this.onTouchedCb();
    }
  }

  protected onTriggerKeydown(ev: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      if (!this.open()) {
        this.open.set(true);
        this.activeIndex.set(ev.key === 'ArrowDown' ? 0 : this.options.length - 1);
      } else {
        this.moveActive(ev.key === 'ArrowDown' ? 1 : -1);
      }
      return;
    }
    if ((ev.key === 'Enter' || ev.key === ' ') && this.open()) {
      ev.preventDefault();
      const opt = this.options[this.activeIndex()];
      if (opt) {
        this.select(opt);
      }
    }
  }

  protected onPanelKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      this.moveActive(1);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      this.moveActive(-1);
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      const opt = this.options[this.activeIndex()];
      if (opt) {
        this.select(opt);
      }
    }
  }

  private moveActive(delta: number): void {
    const n = this.options.length;
    if (n === 0) {
      return;
    }
    const next = (this.activeIndex() + delta + n) % n;
    this.activeIndex.set(next);
  }

  protected isDisabled(): boolean {
    return this.disabled;
  }
}
