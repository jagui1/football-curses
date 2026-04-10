import { Injectable } from '@angular/core';

/** Regular season start (Thursday). Update each season in one place. */
export const SEASON_START = '2025-09-04';

@Injectable({ providedIn: 'root' })
export class SeasonService {
  getCurrentNflWeek(): number {
    const start = this.parseLocalDate(SEASON_START);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const diffMs = today.getTime() - start.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const raw = Math.floor(diffDays / 7) + 1;
    return Math.min(Math.max(raw, 1), 22);
  }

  getWeekLabel(week: number): string {
    switch (week) {
      case 19:
        return 'Wild Card Weekend';
      case 20:
        return 'Divisional Round';
      case 21:
        return 'Championship Weekend';
      case 22:
        return 'Super Bowl';
      default:
        return `Week ${week}`;
    }
  }

  /**
   * Human-readable inclusive range for the 7-day window anchored at season start
   * (e.g. "Sep 4 – Sep 10" for week 1 when season starts Sep 4).
   */
  getWeekDateRangeLabel(week: number): string {
    const start = this.weekWindowStart(week);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${this.formatShort(start)} – ${this.formatShort(end)}`;
  }

  /** First day of the NFL week window (season Thursday + (week - 1) × 7 days). */
  weekWindowStart(week: number): Date {
    const base = this.parseLocalDate(SEASON_START);
    base.setDate(base.getDate() + (week - 1) * 7);
    return base;
  }

  private formatShort(d: Date): string {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  private parseLocalDate(isoDate: string): Date {
    const [y, m, d] = isoDate.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
}
