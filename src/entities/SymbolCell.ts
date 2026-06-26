import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { SYMBOL_VISUALS, SYMBOL_SIZE } from "../config/visuals";

const CORNER_RADIUS = 12;
const HIGHLIGHT_BORDER = 4;

export class SymbolCell extends Container {
  private bg: Graphics;
  private _label: Text;
  private highlightRing: Graphics;

  public symbolId = "";

  constructor() {
    super();

    this.bg = new Graphics();
    this.addChild(this.bg);

    this.highlightRing = new Graphics();
    this.highlightRing.visible = false;
    this.addChild(this.highlightRing);

    this._label = new Text({
      text: "",
      style: new TextStyle({
        fill: "#ffffff",
        fontSize: 28,
        fontWeight: "bold",
        fontFamily: "Arial",
      }),
    });
    this._label.anchor.set(0.5);
    this._label.x = SYMBOL_SIZE / 2;
    this._label.y = SYMBOL_SIZE / 2;
    this.addChild(this._label);
  }

  public setSymbol(id: string) {
    this.symbolId = id;
    const visual = SYMBOL_VISUALS[id] ?? { color: 0x555555, label: "?" };

    this.bg.clear();
    this.bg
      .roundRect(0, 0, SYMBOL_SIZE, SYMBOL_SIZE, CORNER_RADIUS)
      .fill(visual.color);

    this.bg
      .roundRect(2, 2, SYMBOL_SIZE - 4, SYMBOL_SIZE - 4, CORNER_RADIUS - 2)
      .stroke({ color: 0x000000, alpha: 0.2, width: 2 });

    this._label.text = visual.label;
    this.clearHighlight();
  }

  public setHighlight(glowColor: number) {
    this.highlightRing.clear();
    this.highlightRing
      .roundRect(
        -HIGHLIGHT_BORDER,
        -HIGHLIGHT_BORDER,
        SYMBOL_SIZE + HIGHLIGHT_BORDER * 2,
        SYMBOL_SIZE + HIGHLIGHT_BORDER * 2,
        CORNER_RADIUS + HIGHLIGHT_BORDER,
      )
      .stroke({ color: glowColor, width: HIGHLIGHT_BORDER * 2 });

    this.highlightRing.visible = true;
  }

  public clearHighlight() {
    this.highlightRing.visible = false;
  }
}
