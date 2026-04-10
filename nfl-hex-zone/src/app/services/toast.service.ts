import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);
  private timer: ReturnType<typeof setTimeout> | null = null;

  show(text: string, durationMs: number): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.message.set(text);
    this.timer = setTimeout(() => {
      this.message.set(null);
      this.timer = null;
    }, durationMs);
  }
}
