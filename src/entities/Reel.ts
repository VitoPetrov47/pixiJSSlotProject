import { Container } from "pixi.js";
import { SymbolCell } from "./SymbolCell";
import { SYMBOL_SIZE, SYMBOL_GAP, ROW_COUNT } from "../config/visuals";

const CELL_STEP = SYMBOL_SIZE + SYMBOL_GAP;
const EXTRA_SYMBOLS = 6;
const ALL_IDS = ["A", "B", "C", "D", "WILD", "SCATTER"];

export class Reel extends Container {
  private cells: SymbolCell[] = [];

  private strip!: Container;
  private stripCells: SymbolCell[] = [];

  private _spinning = false;
  private stripY = 0;
  private targetStripY = 0;
  private spinSpeed = 0;
  private resolveAnim?: () => void;

  constructor() {
    super();
    this.buildStrip();
    this.buildVisibleCells();
  }

  private buildStrip() {
    this.strip = new Container();
    this.strip.visible = false;
    this.addChild(this.strip);

    const total = EXTRA_SYMBOLS + ROW_COUNT;
    for (let i = 0; i < total; i++) {
      const cell = new SymbolCell();
      cell.y = i * CELL_STEP;
      this.strip.addChild(cell);
      this.stripCells.push(cell);
    }
  }

  private buildVisibleCells() {
    for (let r = 0; r < ROW_COUNT; r++) {
      const cell = new SymbolCell();
      cell.y = r * CELL_STEP;
      this.addChild(cell);
      this.cells.push(cell);
    }
  }

  public setSymbols(column: string[]) {
    for (let r = 0; r < ROW_COUNT; r++) {
      this.cells[r].setSymbol(column[r]);
    }
  }

  public getCell(row: number): SymbolCell {
    return this.cells[row];
  }

  public clearHighlights() {
    this.cells.forEach((c) => c.clearHighlight());
  }

  public async spin(finalColumn: string[], durationMs: number): Promise<void> {
    return new Promise((resolve) => {
      this.resolveAnim = resolve;

      const total = this.stripCells.length;
      for (let i = 0; i < total - ROW_COUNT; i++) {
        this.stripCells[i].setSymbol(this.randomId());
      }
      for (let r = 0; r < ROW_COUNT; r++) {
        this.stripCells[total - ROW_COUNT + r].setSymbol(finalColumn[r]);
      }

      this.stripY = -(EXTRA_SYMBOLS * CELL_STEP);
      this.strip.y = this.stripY;
      this.strip.visible = true;

      this.cells.forEach((c) => (c.visible = false));

      this.targetStripY = 0;
      this._spinning = true;

      const distance = this.targetStripY - this.stripY;
      this.spinSpeed = distance / durationMs;
    });
  }

  public update(dtMs: number) {
    if (!this._spinning) return;

    this.stripY += this.spinSpeed * dtMs;

    if (this.stripY >= this.targetStripY) {
      this.stripY = this.targetStripY;
      this._spinning = false;
      this.strip.visible = false;
      this.cells.forEach((c) => (c.visible = true));

      const total = this.stripCells.length;
      for (let r = 0; r < ROW_COUNT; r++) {
        const src = this.stripCells[total - ROW_COUNT + r];
        this.cells[r].setSymbol(src.symbolId);
      }

      this.resolveAnim?.();
    } else {
      this.strip.y = this.stripY;
    }
  }

  private randomId() {
    return ALL_IDS[Math.floor(Math.random() * ALL_IDS.length)];
  }
}
