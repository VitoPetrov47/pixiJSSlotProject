import { Container, Graphics, Text, TextStyle } from "pixi.js";

type ButtonState = "idle" | "disabled";

const W = 160;
const H = 56;
const R = 28;

const COLORS: Record<ButtonState, number> = {
  idle:     0xf39c12,
  disabled: 0x555566,
};

export class SpinButton extends Container {
  private bg: Graphics;
  private _label: Text;

  public onSpin?: () => void;

  constructor() {
    super();

    this.bg = new Graphics();
    this.addChild(this.bg);

    this._label = new Text({
      text: "SPIN",
      style: new TextStyle({
        fill: "#ffffff",
        fontSize: 22,
        fontWeight: "bold",
        fontFamily: "Arial",
      }),
    });
    this._label.anchor.set(0.5);
    this._label.x = W / 2;
    this._label.y = H / 2;
    this.addChild(this._label);

    this.eventMode = "static";
    this.cursor = "pointer";
    this.on("pointerdown", () => {
      if (this.onSpin) this.onSpin();
    });

    this.setState("idle");
  }

  public setState(state: ButtonState) {
    this.bg.clear();
    this.bg
      .roundRect(0, 0, W, H, R)
      .fill(COLORS[state]);

    this.eventMode = state === "idle" ? "static" : "none";
    this.cursor   = state === "idle" ? "pointer" : "default";
    this.alpha    = state === "idle" ? 1 : 0.5;
  }

  public get width() { return W; }
  public get height() { return H; }
}
