# Pixi Slot

Мини-слот на PixiJS + TypeScript.

## Запуск

```bash
npm install
npm run dev
```

Открыть http://localhost:5173

## Сборка

```bash
npm run build
npm run preview   # предпросмотр продакшн-сборки
```

## Архитектура

```
src/
  config/
    data.json        — данные спинов, конфиг, символы, пэйлайны
    types.ts         — TypeScript-интерфейсы для JSON
    visuals.ts       — цвета символов, константы размеров
  core/
    SpinEngine.ts    — чистая игровая логика (без Pixi): баланс, ставка, последовательность спинов
  entities/
    SymbolCell.ts    — один символ: цветная плашка + текст + подсветка
    Reel.ts          — барабан (колонка): анимация прокрутки
    Grid.ts          — сетка 5×3 из барабанов, управление highlight
  ui/
    SpinButton.ts    — кнопка SPIN с состояниями idle/disabled
    HUD.ts           — баланс, ставка, выигрыш
    WinBanner.ts     — всплывающий баннер с fade-out
  scenes/
    GameScene.ts     — оркестрация: связывает SpinEngine, Grid, HUD, кнопку
  main.ts            — инициализация Pixi Application
```

## Игровая логика

- Спины берутся последовательно из `data.json`; после последнего — цикл начинается заново.
- При выигрыше по пэйлайну — подсвечиваются выигрышные ячейки (каждый пэйлайн своим цветом).
- Scatter-бонус показывает специальный баннер «BONUS TRIGGERED».
- `SpinEngine` не содержит никаких импортов Pixi — логику можно тестировать отдельно.
