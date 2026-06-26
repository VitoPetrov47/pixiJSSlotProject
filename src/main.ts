import { Application, Ticker } from "pixi.js";
import { GameScene } from "./scenes/GameScene";
import type { GameData } from "./config/types";
import rawData from "./config/data.json";

async function init() {
  const data = rawData as GameData;

  const app = new Application();

  await app.init({
    width: 860,
    height: 600,
    backgroundColor: 0x0a0a1a,
    antialias: true,
  });

  document.body.appendChild(app.canvas);

  const scene = new GameScene(data);
  app.stage.addChild(scene);

  Ticker.shared.add((ticker) => {
    scene.update(ticker.deltaMS);
  });
}

init().catch(console.error);
