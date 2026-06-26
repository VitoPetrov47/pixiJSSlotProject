export type SymbolType = "regular" | "wild" | "scatter";

export interface SymbolConfig {
  id: string;
  type: SymbolType;
  payout?: Record<string, number>;
}

export type Position = [number, number];

export interface Payline {
  id: number;
  positions: Position[];
}

export interface WinLine {
  payline: number;
  symbol: string;
  count: number;
  positions: Position[];
}

export interface SpinWin {
  amount: number;
  lines?: WinLine[];
  scatterCount?: number;
  bonusTriggered?: boolean;
}

export interface SpinResult {
  id: number;
  matrix: string[][];
  win: SpinWin;
}

export interface GameConfig {
  rows: number;
  columns: number;
  bet: number;
  balance: number;
}

export interface GameData {
  gameConfig: GameConfig;
  symbols: SymbolConfig[];
  paylines: Payline[];
  spins: SpinResult[];
}
