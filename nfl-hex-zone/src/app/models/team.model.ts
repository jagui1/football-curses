import { Player } from './player.model';

export interface Team {
  name: string;
  espnId: string;
  logoUrl: string;
  players: Player[];
}
