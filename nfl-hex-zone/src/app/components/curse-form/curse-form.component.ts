import { Component, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImageSelectComponent } from '../image-select/image-select.component';
import { RosterService } from '../../services/roster.service';
import { SeasonService } from '../../services/season.service';
import { CurseStoreService } from '../../services/curse-store.service';
import { CURSE_FLAVORS } from '../../data/curses.data';
import { CurseIntensity, CurseRecord } from '../../models/curse-record.model';
import type { ImageSelectOption } from '../image-select/image-select.component';

@Component({
  selector: 'app-curse-form',
  imports: [ReactiveFormsModule, ImageSelectComponent],
  templateUrl: './curse-form.component.html',
  styleUrl: './curse-form.component.css',
})
export class CurseFormComponent {
  readonly hexCast = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly roster = inject(RosterService);
  private readonly season = inject(SeasonService);
  private readonly store = inject(CurseStoreService);

  readonly teamOptions: ImageSelectOption[] = this.roster.teams.map((t) => ({
    label: t.name,
    imageUrl: t.logoUrl,
    value: t.espnId,
  }));

  playerOptions: ImageSelectOption[] = [];

  readonly form = this.fb.group({
    submitterName: ['', Validators.required],
    team: [null as string | null, Validators.required],
    player: this.fb.control<string | null>(
      { value: null, disabled: true },
      Validators.required,
    ),
    reason: ['', [Validators.required, Validators.maxLength(280)]],
    intensity: this.fb.nonNullable.control<CurseIntensity>('FULL_HEX', Validators.required),
    nflWeek: this.fb.nonNullable.control(this.season.getCurrentNflWeek(), [
      Validators.required,
      Validators.min(1),
      Validators.max(22),
    ]),
  });

  constructor() {
    this.form
      .get('team')!
      .valueChanges.pipe(takeUntilDestroyed())
      .subscribe((espnId) => {
        const pc = this.form.get('player')!;
        if (espnId) {
          pc.enable({ emitEvent: false });
          pc.setValue(null);
          this.playerOptions = this.roster.getPlayersForTeam(espnId).map((p) => ({
            label: `${p.name} (${p.position})`,
            imageUrl: `https://a.espncdn.com/i/headshots/nfl/players/full/${p.espnId}.png`,
            value: p.espnId,
          }));
        } else {
          pc.setValue(null);
          pc.disable({ emitEvent: false });
          this.playerOptions = [];
        }
      });
  }

  protected reasonLength(): number {
    return this.form.get('reason')?.value?.length ?? 0;
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const team = this.roster.getTeam(v.team!);
    const player = team?.players.find((p) => p.espnId === v.player);
    if (!team || !player) {
      this.form.markAllAsTouched();
      return;
    }
    const flavor =
      CURSE_FLAVORS[Math.floor(Math.random() * CURSE_FLAVORS.length)] ?? '';
    const record: CurseRecord = {
      id: crypto.randomUUID(),
      submitterName: v.submitterName!,
      team: team.name,
      teamEspnId: team.espnId,
      playerName: player.name,
      playerEspnId: player.espnId,
      reason: v.reason!,
      intensity: v.intensity!,
      curseFlavor: flavor,
      timestamp: new Date().toISOString(),
      nflWeek: v.nflWeek!,
      verdict: null,
      verdictTimestamp: null,
    };
    this.store.add(record);
    this.hexCast.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.form.reset({
      submitterName: '',
      team: null,
      reason: '',
      intensity: 'FULL_HEX',
      nflWeek: this.season.getCurrentNflWeek(),
    });
    const pc = this.form.get('player')!;
    pc.setValue(null);
    pc.disable({ emitEvent: false });
    this.playerOptions = [];
  }
}
