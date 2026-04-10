import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  computed,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { CurseStoreService } from '../../services/curse-store.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-password-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-password-modal.component.html',
  styleUrl: './admin-password-modal.component.css',
})
export class AdminPasswordModalComponent implements AfterViewInit {
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly store = inject(CurseStoreService);

  readonly dismissed = output<void>();
  /** User confirmed destruction (password was verified in-app). Parent runs clear + skull + toast. */
  readonly burnConfirmed = output<void>();

  protected readonly step = signal<'password' | 'confirm'>('password');
  passwordInput = '';
  protected readonly error = signal<string | null>(null);
  protected readonly inputShake = signal(false);

  protected readonly curseCount = computed(() => this.store.curses().length);

  private readonly pwdInput =
    viewChild<ElementRef<HTMLInputElement>>('pwdInput');

  ngAfterViewInit(): void {
    queueMicrotask(() => this.pwdInput()?.nativeElement?.focus());
  }

  protected adminAttemptsRemaining(): number {
    return Math.max(0, 3 - this.auth.adminAttempts());
  }

  protected async onDestroyPassword(): Promise<void> {
    this.error.set(null);
    const pwd = this.passwordInput;
    const ok = await this.auth.verifyAdmin(pwd);
    if (ok) {
      this.passwordInput = '';
      this.step.set('confirm');
      return;
    }
    if (this.auth.adminLockout()) {
      this.passwordInput = '';
      this.dismissed.emit();
      this.toast.show(
        '🚫 Too many failed attempts. The hexes are safe... for now.',
        3000,
      );
      return;
    }
    this.error.set('Access denied. The archive resists you.');
    this.triggerShake();
  }

  protected onBackdropClick(): void {
    if (this.step() === 'password') {
      this.onAbort();
    } else {
      this.onWaitNo();
    }
  }

  protected onAbort(): void {
    this.passwordInput = '';
    this.error.set(null);
    this.step.set('password');
    this.auth.adminModeActive.set(false);
    this.dismissed.emit();
  }

  protected onWaitNo(): void {
    this.step.set('password');
    this.auth.adminModeActive.set(false);
    this.dismissed.emit();
  }

  protected onBurnItAll(): void {
    this.auth.adminModeActive.set(false);
    this.burnConfirmed.emit();
  }

  private triggerShake(): void {
    this.inputShake.set(true);
    setTimeout(() => this.inputShake.set(false), 450);
  }
}
