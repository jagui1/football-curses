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

  private parseLocalDate(isoDate: string): Date {
    const [y, m, d] = isoDate.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
}
