import { Injectable, signal } from '@angular/core';
import { CurseRecord } from '../models/curse-record.model';

const STORAGE_KEY = 'hexzone_curses';

@Injectable({ providedIn: 'root' })
export class CurseStoreService {
  private readonly _curses = signal<CurseRecord[]>(this.load());
  readonly curses = this._curses.asReadonly();

  /** Set briefly after `add()` so the Hex Board can animate only the newest card. */
  private readonly _lastAddedCurseId = signal<string | null>(null);
  readonly lastAddedCurseId = this._lastAddedCurseId.asReadonly();

  add(record: CurseRecord): void {
    const updated = [record, ...this._curses()];
    this._curses.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    this._lastAddedCurseId.set(record.id);
    setTimeout(() => this._lastAddedCurseId.set(null), 500);
  }

  clear(): void {
    this._curses.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  updateVerdict(id: string, verdict: 'pending' | 'cast' | 'rejected'): void {
    const current = this._curses();
    const idx = current.findIndex((r) => r.id === id);
    if (idx === -1) {
      return;
    }
    const ts = new Date().toISOString();
    const next = current.map((r, i) =>
      i === idx ? { ...r, verdict, verdictTimestamp: ts } : r,
    );
    this._curses.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  private load(): CurseRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null || raw === 'null') {
        return [];
      }
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed as CurseRecord[];
    } catch {
      return [];
    }
  }
}
