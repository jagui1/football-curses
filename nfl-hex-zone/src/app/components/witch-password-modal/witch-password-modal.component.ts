import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-witch-password-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './witch-password-modal.component.html',
  styleUrl: './witch-password-modal.component.css',
})
export class WitchPasswordModalComponent implements AfterViewInit {
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly dismissed = output<void>();
  readonly authenticated = output<void>();

  /** Bound to the password field (plain string works reliably with ngModel in tests). */
  passwordInput = '';
  protected readonly error = signal<string | null>(null);
  protected readonly inputShake = signal(false);
  protected readonly flash = signal(false);

  private readonly pwdInput =
    viewChild<ElementRef<HTMLInputElement>>('pwdInput');

  ngAfterViewInit(): void {
    queueMicrotask(() => this.pwdInput()?.nativeElement?.focus());
  }

  protected attemptsRemaining(): number {
    return Math.max(0, 3 - this.auth.witchAttempts());
  }

  protected async onConfirm(): Promise<void> {
    this.error.set(null);
    const pwd = this.passwordInput;
    const ok = await this.auth.verifyWitch(pwd);
    if (ok) {
      this.passwordInput = '';
      this.flash.set(true);
      setTimeout(() => {
        this.flash.set(false);
        this.authenticated.emit();
      }, 280);
      return;
    }
    if (this.auth.witchLockout()) {
      this.passwordInput = '';
      this.dismissed.emit();
      this.toast.show(
        '🚫 Too many failed attempts. The coven is watching.',
        3000,
      );
      return;
    }
    this.error.set('The spirits reject you.');
    this.triggerShake();
  }

  protected onBegone(): void {
    this.passwordInput = '';
    this.error.set(null);
    this.dismissed.emit();
  }

  private triggerShake(): void {
    this.inputShake.set(true);
    setTimeout(() => this.inputShake.set(false), 450);
  }
}
