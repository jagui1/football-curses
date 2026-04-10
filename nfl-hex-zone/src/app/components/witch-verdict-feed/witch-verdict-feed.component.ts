import { Component, computed, inject } from '@angular/core';
import { CurseStoreService } from '../../services/curse-store.service';
import { CurseCardComponent } from '../curse-card/curse-card.component';

@Component({
  selector: 'app-witch-verdict-feed',
  imports: [CurseCardComponent],
  templateUrl: './witch-verdict-feed.component.html',
  styleUrl: './witch-verdict-feed.component.css',
})
export class WitchVerdictFeedComponent {
  private readonly store = inject(CurseStoreService);

  protected readonly verdictCurses = computed(() =>
    this.store
      .curses()
      .filter((c) => c.verdict !== null)
      .sort((a, b) => {
        const vt = (b.verdictTimestamp ?? '').localeCompare(
          a.verdictTimestamp ?? '',
        );
        if (vt !== 0) return vt;
        return (b.timestamp ?? '').localeCompare(a.timestamp ?? '');
      }),
  );
}
