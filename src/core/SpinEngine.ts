import type { GameData, SpinResult } from "../config/types";

export class SpinEngine {
  private data: GameData;
  private spinIndex = 0;

  public balance: number;
  public readonly bet: number;

  constructor(data: GameData) {
    this.data = data;
    this.balance = data.gameConfig.balance;
    this.bet = data.gameConfig.bet;
  }

  public get hasMoreSpins(): boolean {
    return this.spinIndex < this.data.spins.length;
  }

  public get totalSpins(): number {
    return this.data.spins.length;
  }

  public get currentSpinIndex(): number {
    return this.spinIndex;
  }

  public nextSpin(): SpinResult {
    if (!this.hasMoreSpins) throw new Error("No more spins in data");

    const spin = this.data.spins[this.spinIndex];
    this.spinIndex++;

    this.balance -= this.bet;
    this.balance += spin.win.amount;

    return spin;
  }

  public reset(): void {
    this.spinIndex = 0;
    this.balance = this.data.gameConfig.balance;
  }
}
