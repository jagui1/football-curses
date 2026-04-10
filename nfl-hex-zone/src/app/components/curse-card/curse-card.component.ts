import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CurseIntensity, CurseRecord } from '../../models/curse-record.model';
import { CurseStoreService } from '../../services/curse-store.service';
import { RosterService } from '../../services/roster.service';

@Component({
  selector: 'app-curse-card',
  imports: [CommonModule],
  templateUrl: './curse-card.component.html',
  styleUrl: './curse-card.component.css',
})
export class CurseCardComponent implements OnChanges {
  @Input({ required: true }) curse!: CurseRecord;
  /** Hex Board: animate only the card just submitted this session. */
  @Input() playEntrance = false;
  /** `feed` enables Witch's Verdict pulse styles; `archive` is read-only (no verdict buttons). */
  @Input() variant: 'board' | 'feed' | 'archive' = 'board';

  private readonly roster = inject(RosterService);
  protected readonly auth = inject(AuthService);
  private readonly curseStore = inject(CurseStoreService);
  protected readonly showHeadshot = signal(true);
  protected readonly sparkleActive = signal(false);
  protected readonly rejectFlashActive = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['curse']) {
      this.showHeadshot.set(true);
    }
  }

  protected teamLogoUrl(): string {
    return `https://a.espncdn.com/i/teamlogos/nfl/500/${this.curse.teamEspnId}.png`;
  }

  protected headshotUrl(): string {
    return `https://a.espncdn.com/i/headshots/nfl/players/full/${this.curse.playerEspnId}.png`;
  }

  protected playerPosition(): string {
    const team = this.roster.getTeam(this.curse.teamEspnId);
    return (
      team?.players.find((p) => p.espnId === this.curse.playerEspnId)?.position ??
      ''
    );
  }

  protected onHeadshotError(): void {
    this.showHeadshot.set(false);
  }

  protected fallbackEmoji(): string {
    return this.emojiForPosition(this.playerPosition());
  }

  private emojiForPosition(pos: string): string {
    const p = pos.toUpperCase();
    if (p === 'QB') return '🎯';
    if (p === 'RB' || p === 'FB') return '🏃';
    if (p === 'WR' || p === 'TE') return '🙌';
    if (['C', 'G', 'T', 'OT', 'OG', 'OL'].includes(p)) return '🧱';
    if (['DE', 'DT', 'NT', 'DL'].includes(p)) return '💪';
    if (p.includes('LB')) return '🦾';
    if (['CB', 'S', 'FS', 'SS', 'DB'].includes(p)) return '🛡️';
    if (['K', 'P', 'LS'].includes(p)) return '🦵';
    return '🏈';
  }

  protected intensityLabel(i: CurseIntensity): string {
    switch (i) {
      case 'MILD_JINX':
        return 'Mild Jinx';
      case 'FULL_HEX':
        return 'Full Hex';
      case 'ETERNAL_DAMNATION':
        return 'Eternal Damnation';
    }
  }

  protected showWitchVerdictControls(): boolean {
    return (
      this.variant === 'board' &&
      this.auth.witchModeActive()
    );
  }

  protected onVerdictClick(verdict: 'pending' | 'cast' | 'rejected'): void {
    this.curseStore.updateVerdict(this.curse.id, verdict);
    if (verdict === 'cast') {
      this.sparkleActive.set(true);
      setTimeout(() => this.sparkleActive.set(false), 1000);
    } else if (verdict === 'rejected') {
      this.rejectFlashActive.set(true);
      setTimeout(() => this.rejectFlashActive.set(false), 500);
    }
  }
}
