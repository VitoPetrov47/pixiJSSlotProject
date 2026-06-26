import { Container, Graphics, Text, TextStyle } from "pixi.js";

interface HUDField {
  titleText: Text;
  valueText: Text;
}

const FIELD_W = 160;
const FIELD_H = 64;
const R = 10;
const GAP = 16;

export class HUD extends Container {
  private balanceField: HUDField;
  private betField: HUDField;
  private winField: HUDField;

  public readonly totalWidth: number;

  constructor() {
    super();

    this.balanceField = this.createField(0, "BALANCE", "0");
    this.betField     = this.createField(FIELD_W + GAP, "BET", "0");
    this.winField     = this.createField((FIELD_W + GAP) * 2, "WIN", "0");

    this.totalWidth = FIELD_W * 3 + GAP * 2;
  }

  private createField(offsetX: number, title: string, value: string): HUDField {
    const bg = new Graphics()
      .roundRect(0, 0, FIELD_W, FIELD_H, R)
      .fill({ color: 0x1a1a2e, alpha: 0.9 })
      .stroke({ color: 0x444466, width: 1 });
    bg.x = offsetX;
    this.addChild(bg);

    const titleText = new Text({
      text: title,
      style: new TextStyle({ fill: "#888899", fontSize: 11, fontFamily: "Arial", letterSpacing: 2 }),
    });
    titleText.x = offsetX + 12;
    titleText.y = 10;
    this.addChild(titleText);

    const valueText = new Text({
      text: value,
      style: new TextStyle({ fill: "#ffffff", fontSize: 22, fontWeight: "bold", fontFamily: "Arial" }),
    });
    valueText.x = offsetX + 12;
    valueText.y = 30;
    this.addChild(valueText);

    return { titleText, valueText };
  }

  public setBalance(amount: number) {
    this.balanceField.valueText.text = amount.toFixed(0);
  }

  public setBet(amount: number) {
    this.betField.valueText.text = amount.toFixed(0);
  }

  public setWin(amount: number) {
    this.winField.valueText.text = amount > 0 ? `+${amount}` : "–";
    this.winField.valueText.style.fill = amount > 0 ? "#f1c40f" : "#888899";
  }

  public clearWin() {
    this.winField.valueText.text = "–";
    this.winField.valueText.style.fill = "#888899";
  }
}
