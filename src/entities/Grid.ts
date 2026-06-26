import { Container, Graphics } from "pixi.js";
import { Reel } from "./Reel";
import {
  REEL_COUNT,
  ROW_COUNT,
  SYMBOL_SIZE,
  SYMBOL_GAP,
  SPIN_DURATION_MS,
  REEL_STAGGER_MS,
} from "../config/visuals";
import type { Position } from "../config/types";

const CELL_STEP = SYMBOL_SIZE + SYMBOL_GAP;

export class Grid extends Container {
  private reels: Reel[] = [];
  private maskRect: Graphics;

  public readonly gridWidth  = REEL_COUNT * CELL_STEP - SYMBOL_GAP;
  public readonly gridHeight = ROW_COUNT  * CELL_STEP - SYMBOL_GAP;

  constructor() {
    super();

    this.maskRect = new Graphics()
      .rect(-8, -8, this.gridWidth + 16, this.gridHeight + 16)
      .fill(0xffffff);
    this.addChild(this.maskRect);
    this.mask = this.maskRect;

    for (let col = 0; col < REEL_COUNT; col++) {
      const reel = new Reel();
      reel.x = col * CELL_STEP;
      this.addChild(reel);
      this.reels.push(reel);
    }
  }

  public setMatrix(matrix: string[][]) {
    for (let col = 0; col < REEL_COUNT; col++) {
      const column = matrix.map((row) => row[col]);
      this.reels[col].setSymbols(column);
    }
  }

  public async spinTo(matrix: string[][]): Promise<void> {
    const promises = this.reels.map((reel, col) => {
      const column = matrix.map((row) => row[col]);
      const delay = col * REEL_STAGGER_MS;
      const duration = SPIN_DURATION_MS + delay;

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          reel.spin(column, duration - delay).then(resolve);
        }, delay);
      });
    });

    await Promise.all(promises);
  }

  public highlightPositions(positions: Position[], color: number) {
    this.clearHighlights();
    for (const [col, row] of positions) {
      this.reels[col]?.getCell(row)?.setHighlight(color);
    }
  }

  public clearHighlights() {
    this.reels.forEach((r) => r.clearHighlights());
  }

  public update(dtMs: number) {
    this.reels.forEach((r) => r.update(dtMs));
  }
}
