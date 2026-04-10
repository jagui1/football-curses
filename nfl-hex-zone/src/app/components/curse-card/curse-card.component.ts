import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { CurseIntensity, CurseRecord } from '../../models/curse-record.model';
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
  /** `feed` enables Witch's Verdict pulse styles (Phase 3 / 4). */
  @Input() variant: 'board' | 'feed' = 'board';

  private readonly roster = inject(RosterService);
  protected readonly showHeadshot = signal(true);

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
}
