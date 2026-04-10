import { Injectable } from '@angular/core';
import { ROSTERS } from '../data/rosters.data';
import { Player } from '../models/player.model';
import { Team } from '../models/team.model';

@Injectable({ providedIn: 'root' })
export class RosterService {
  readonly teams: Team[] = [...ROSTERS].sort((a, b) => a.name.localeCompare(b.name));

  getPlayersForTeam(espnId: string): Player[] {
    return this.teams.find((t) => t.espnId === espnId)?.players ?? [];
  }

  getTeam(espnId: string): Team | undefined {
    return this.teams.find((t) => t.espnId === espnId);
  }
}
