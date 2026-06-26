import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class WinBanner extends Container {
  private bg: Graphics;
  private _label: Text;
  private subLabel: Text;

  constructor() {
    super();
    this.visible = false;

    this.bg = new Graphics();
    this.addChild(this.bg);

    this._label = new Text({
      text: "",
      style: new TextStyle({
        fill: "#f1c40f",
        fontSize: 38,
        fontWeight: "bold",
        fontFamily: "Arial",
        dropShadow: {
          color: "#000000",
          blur: 6,
          distance: 3,
        },
      }),
    });
    this._label.anchor.set(0.5);
    this.addChild(this._label);

    this.subLabel = new Text({
      text: "",
      style: new TextStyle({ fill: "#ffffff", fontSize: 16, fontFamily: "Arial" }),
    });
    this.subLabel.anchor.set(0.5);
    this.subLabel.y = 28;
    this.addChild(this.subLabel);
  }

  public show(win: number, extra?: string) {
    const w = 320, h = 80;

    this.bg.clear()
      .roundRect(-w / 2, -h / 2, w, h, 16)
      .fill({ color: 0x000000, alpha: 0.75 })
      .stroke({ color: 0xf1c40f, width: 2 });

    this._label.text = `WIN  +${win}`;
    this.subLabel.text = extra ?? "";
    this.visible = true;
    this.alpha = 1;
  }

  public hide() {
    this.visible = false;
  }

  public fadeOut(dtMs: number, durationMs = 1500): boolean {
    if (!this.visible) return true;
    this.alpha -= dtMs / durationMs;
    if (this.alpha <= 0) {
      this.hide();
      return true;
    }
    return false;
  }
}
