export type CurseIntensity = 'MILD_JINX' | 'FULL_HEX' | 'ETERNAL_DAMNATION';

export interface CurseRecord {
  id: string;
  submitterName: string;
  team: string;
  teamEspnId: string;
  playerName: string;
  playerEspnId: string;
  reason: string;
  intensity: CurseIntensity;
  curseFlavor: string;
  timestamp: string;
  nflWeek: number;
  verdict: 'pending' | 'cast' | 'rejected' | null;
  verdictTimestamp: string | null;
}
