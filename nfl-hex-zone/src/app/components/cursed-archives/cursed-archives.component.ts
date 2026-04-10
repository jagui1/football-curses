import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CurseRecord } from '../../models/curse-record.model';
import { CurseStoreService } from '../../services/curse-store.service';
import { SeasonService } from '../../services/season.service';
import { CurseCardComponent } from '../curse-card/curse-card.component';

export interface ArchiveWeekBucket {
  week: number;
  curses: CurseRecord[];
}

@Component({
  selector: 'app-cursed-archives',
  imports: [CommonModule, CurseCardComponent],
  templateUrl: './cursed-archives.component.html',
  styleUrl: './cursed-archives.component.css',
})
export class CursedArchivesComponent {
  private readonly store = inject(CurseStoreService);
  private readonly season = inject(SeasonService);

  /** Descending week number (most recent first). */
  protected readonly buckets = computed((): ArchiveWeekBucket[] => {
    const map = new Map<number, CurseRecord[]>();
    for (const c of this.store.curses()) {
      const w = c.nflWeek;
      const list = map.get(w) ?? [];
      list.push(c);
      map.set(w, list);
    }
    for (const [, list] of map) {
      list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
    const weeks = [...map.keys()].sort((a, b) => b - a);
    return weeks.map((week) => ({
      week,
      curses: map.get(week)!,
    }));
  });

  protected readonly pillWeeks = computed(() =>
    [...new Set(this.store.curses().map((c) => c.nflWeek))].sort(
      (a, b) => a - b,
    ),
  );

  protected readonly expandedWeeks = signal<Set<number>>(new Set());
  protected readonly activePillWeek = signal<number | null>(null);

  private defaultExpandInitialized = false;

  constructor() {
    effect(() => {
      const list = this.buckets();
      if (list.length === 0) {
        this.defaultExpandInitialized = false;
        this.expandedWeeks.set(new Set());
        this.activePillWeek.set(null);
        return;
      }
      if (!this.defaultExpandInitialized) {
        const cw = this.season.getCurrentNflWeek();
        const matchCurrent = list.find((b) => b.week === cw);
        const expandWeek = matchCurrent ? cw : list[0]!.week;
        this.expandedWeeks.set(new Set([expandWeek]));
        this.activePillWeek.set(expandWeek);
        this.defaultExpandInitialized = true;
      }
    });
  }

  protected weekLabel(week: number): string {
    return this.season.getWeekLabel(week);
  }

  protected weekRange(week: number): string {
    return this.season.getWeekDateRangeLabel(week);
  }

  protected isExpanded(week: number): boolean {
    return this.expandedWeeks().has(week);
  }

  protected toggleBucket(week: number): void {
    const s = new Set(this.expandedWeeks());
    if (s.has(week)) {
      s.delete(week);
    } else {
      s.add(week);
    }
    this.expandedWeeks.set(s);
    this.activePillWeek.set(week);
  }

  protected selectPill(week: number): void {
    this.activePillWeek.set(week);
    this.expandedWeeks.set(new Set([week]));
    queueMicrotask(() => {
      document
        .getElementById(`archive-bucket-${week}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  protected pillIsActive(week: number): boolean {
    return this.activePillWeek() === week;
  }
}
