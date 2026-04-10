import { Component, inject } from '@angular/core';
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

  protected clearStub(): void {
    /* Phase 4 — admin password */
  }
}
