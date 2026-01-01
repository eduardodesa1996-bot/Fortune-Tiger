
export enum BetType {
  FREE = 'FREE',
  REAL = 'REAL'
}

export enum BetResult {
  WIN = 'WIN',
  LOSS = 'LOSS'
}

export interface Bet {
  id: string;
  timestamp: number;
  type: BetType;
  amount: number;
  result: BetResult;
  payout: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  freeSpins: number;
  betHistory: Bet[];
}

export interface GameConfig {
  winProbability: number; // 0 to 1
  minLossesForBoost: number;
  boostedProbability: number;
  payoutMultiplier: number;
}
