import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AdminPasswordModalComponent } from './components/admin-password-modal/admin-password-modal.component';
import { CursedArchivesComponent } from './components/cursed-archives/cursed-archives.component';
import { HeaderComponent } from './components/header/header.component';
import { CurseFormComponent } from './components/curse-form/curse-form.component';
import { HexBoardComponent } from './components/hex-board/hex-board.component';
import { HexOverlayComponent } from './components/hex-overlay/hex-overlay.component';
import { SkullSweepOverlayComponent } from './components/skull-sweep-overlay/skull-sweep-overlay.component';
import { WitchPasswordModalComponent } from './components/witch-password-modal/witch-password-modal.component';
import { WitchVerdictFeedComponent } from './components/witch-verdict-feed/witch-verdict-feed.component';
import { CurseStoreService } from './services/curse-store.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    CurseFormComponent,
    HexBoardComponent,
    CursedArchivesComponent,
    WitchVerdictFeedComponent,
    HexOverlayComponent,
    SkullSweepOverlayComponent,
    WitchPasswordModalComponent,
    AdminPasswordModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);
  protected readonly auth = inject(AuthService);
  protected readonly toast = inject(ToastService);
  private readonly curseStore = inject(CurseStoreService);

  protected readonly overlayVisible = signal(false);
  protected readonly witchModalOpen = signal(false);
  protected readonly adminModalOpen = signal(false);
  protected readonly skullVisible = signal(false);

  constructor() {
    effect(() => {
      const on = this.auth.witchModeActive();
      this.document.body.classList.toggle('witch-mode-active', on);
    });

    const win = this.document.defaultView;
    if (win) {
      const q = new URLSearchParams(win.location.search);
      if (q.get('witch') === 'true' && !this.auth.witchLockout()) {
        this.witchModalOpen.set(true);
      }
    }
  }

  protected onHexCast(): void {
    this.overlayVisible.set(true);
    setTimeout(() => this.overlayVisible.set(false), 1500);
  }

  protected onTriggerWitchModal(): void {
    if (!this.auth.witchLockout()) {
      this.witchModalOpen.set(true);
    }
  }

  protected onWitchModalDismissed(): void {
    this.witchModalOpen.set(false);
  }

  protected onWitchAuthenticated(): void {
    this.witchModalOpen.set(false);
  }

  protected onRequestClearAll(): void {
    this.adminModalOpen.set(true);
  }

  protected onAdminModalDismissed(): void {
    this.adminModalOpen.set(false);
  }

  protected onAdminBurnConfirmed(): void {
    this.curseStore.clear();
    this.adminModalOpen.set(false);
    const w = this.document.defaultView;
    const reduced =
      w?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced) {
      this.toast.show('The hex board has been cleansed. 💀', 4000);
      return;
    }
    this.skullVisible.set(true);
    setTimeout(() => {
      this.skullVisible.set(false);
      this.toast.show('The hex board has been cleansed. 💀', 4000);
    }, 1000);
  }
}
