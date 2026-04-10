import { Component, inject, output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CurseStoreService } from '../../services/curse-store.service';
import { CurseCardComponent } from '../curse-card/curse-card.component';

@Component({
  selector: 'app-hex-board',
  imports: [CurseCardComponent],
  templateUrl: './hex-board.component.html',
  styleUrl: './hex-board.component.css',
})
export class HexBoardComponent {
  protected readonly store = inject(CurseStoreService);
  protected readonly auth = inject(AuthService);

  readonly requestClearAll = output<void>();

  protected onClearAllClick(): void {
    if (this.auth.adminLockout()) {
      return;
    }
    this.requestClearAll.emit();
  }
}
