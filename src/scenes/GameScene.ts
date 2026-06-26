import { Container, Graphics } from "pixi.js";
import { Grid } from "../entities/Grid";
import { SpinEngine } from "../core/SpinEngine";
import { HUD } from "../ui/HUD";
import { SpinButton } from "../ui/SpinButton";
import { WinBanner } from "../ui/WinBanner";
import type { GameData } from "../config/types";

const PAYLINE_COLORS: Record<number, number> = {
  1: 0xf1c40f,
  2: 0xe74c3c,
  3: 0x3498db,
};

const SCATTER_HIGHLIGHT = 0x00FFFA;

const SCREEN_W = 860;
const SCREEN_H = 600;
const PANEL_PADDING = 24;

const WIN_DISPLAY_MS  = 2200;
const FADE_DURATION_MS = 800;

type SceneState = "idle" | "spinning" | "showing_win" | "fading";

export class GameScene extends Container {
  private grid: Grid;
  private engine: SpinEngine;
  private hud: HUD;
  private spinButton: SpinButton;
  private winBanner: WinBanner;

  private state: SceneState = "idle";
  private winTimer = 0;
  private fadingBanner = false;

  constructor(data: GameData) {
    super();

    this.engine = new SpinEngine(data);

    this.buildBackground();
    this.grid = this.buildGrid();
    this.hud  = this.buildHUD();
    this.spinButton = this.buildSpinButton();
    this.winBanner  = this.buildWinBanner();

    this.hud.setBalance(this.engine.balance);
    this.hud.setBet(this.engine.bet);
    this.hud.clearWin();

    const firstSpin = data.spins[0];
    this.grid.setMatrix(firstSpin.matrix);
  }

  private buildBackground() {
    const bg = new Graphics()
      .rect(0, 0, SCREEN_W, SCREEN_H)
      .fill(0x0a0a1a);
    this.addChild(bg);

    const panelW = this.calcGridWidth() + PANEL_PADDING * 2;
    const panelH = this.calcGridHeight() + PANEL_PADDING * 2;
    const panelX = (SCREEN_W - panelW) / 2;
    const panelY = 60;

    const panel = new Graphics()
      .roundRect(0, 0, panelW, panelH, 18)
      .fill({ color: 0x16213e, alpha: 1 })
      .stroke({ color: 0x334466, width: 2 });
    panel.x = panelX;
    panel.y = panelY;
    this.addChild(panel);
  }

  private calcGridWidth(): number {
    const { SYMBOL_SIZE, SYMBOL_GAP, REEL_COUNT } = this.getGridConsts();
    return REEL_COUNT * (SYMBOL_SIZE + SYMBOL_GAP) - SYMBOL_GAP;
  }

  private calcGridHeight(): number {
    const { SYMBOL_SIZE, SYMBOL_GAP, ROW_COUNT } = this.getGridConsts();
    return ROW_COUNT * (SYMBOL_SIZE + SYMBOL_GAP) - SYMBOL_GAP;
  }

  private getGridConsts() {
    return {
      SYMBOL_SIZE: 100,
      SYMBOL_GAP: 8,
      REEL_COUNT: 5,
      ROW_COUNT: 3,
    };
  }

  private buildGrid(): Grid {
    const grid = new Grid();
    grid.x = (SCREEN_W - grid.gridWidth) / 2;
    grid.y = 60 + PANEL_PADDING;
    this.addChild(grid);
    return grid;
  }

  private buildHUD(): HUD {
    const hud = new HUD();
    hud.x = (SCREEN_W - hud.totalWidth) / 2;
    hud.y = SCREEN_H - 140;
    this.addChild(hud);
    return hud;
  }

  private buildSpinButton(): SpinButton {
    const btn = new SpinButton();
    btn.x = (SCREEN_W - btn.width) / 2;
    btn.y = SCREEN_H - 62;

    btn.onSpin = () => void this.handleSpin();
    this.addChild(btn);
    return btn;
  }

  private buildWinBanner(): WinBanner {
    const banner = new WinBanner();
    banner.x = SCREEN_W / 2;
    banner.y = SCREEN_H / 2 - 10;
    this.addChild(banner);
    return banner;
  }

  private async handleSpin() {
    if (this.state !== "idle") return;
    if (!this.engine.hasMoreSpins) {
      this.engine.reset();
    }

    this.state = "spinning";
    this.spinButton.setState("disabled");
    this.grid.clearHighlights();
    this.winBanner.hide();
    this.hud.clearWin();

    const result = this.engine.nextSpin();

    await this.grid.spinTo(result.matrix);

    this.hud.setBalance(this.engine.balance);

    if (result.win.amount > 0) {
      this.showWin(result);
    } else {
      this.endRound();
    }
  }

  private showWin(result: ReturnType<SpinEngine["nextSpin"]>) {
    this.state = "showing_win";
    this.winTimer = WIN_DISPLAY_MS;
    this.fadingBanner = false;

    const { win } = result;
    this.hud.setWin(win.amount);

    if (win.lines && win.lines.length > 0) {
      for (const line of win.lines) {
        const color = PAYLINE_COLORS[line.payline] ?? 0xffffff;
        this.grid.highlightPositions(line.positions, color);
      }
    } else if (win.bonusTriggered) {
      const scatterPositions: [number, number][] = [];
      result.matrix.forEach((row, rowIdx) => {
        row.forEach((symbol, colIdx) => {
          if (symbol === "SCATTER") scatterPositions.push([colIdx, rowIdx]);
        });
      });
      this.grid.highlightPositions(scatterPositions, SCATTER_HIGHLIGHT);
    }

    const extra = win.bonusTriggered ? "🎰 BONUS TRIGGERED!" : undefined;
    this.winBanner.show(win.amount, extra);
  }

  private endRound() {
    this.state = "idle";
    this.spinButton.setState("idle");
  }

  public update(dtMs: number) {
    this.grid.update(dtMs);

    if (this.state === "showing_win") {
      this.winTimer -= dtMs;
      if (this.winTimer <= 0) {
        this.state = "fading";
        this.fadingBanner = true;
      }
    }

    if (this.state === "fading") {
      const done = this.winBanner.fadeOut(dtMs, FADE_DURATION_MS);
      if (done) {
        this.grid.clearHighlights();
        this.endRound();
      }
    }
  }
}
