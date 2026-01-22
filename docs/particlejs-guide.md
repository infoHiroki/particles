# ParticleJS ガイド

参考: [Webサイトに華やかな表現を！ HTML5用パーティクルライブラリ「ParticleJS」を公開](https://ics.media/entry/19164/) - ICS MEDIA

## 概要

- HTML5 Canvas用パーティクルライブラリ
- CreateJSに依存
- MITライセンス（商用利用可）
- 専用デザインツール「Particle Develop」あり

## リンク

- [ParticleJS - GitHub](https://github.com/ics-creative/ParticleJS)
- [ParticleJS - APIドキュメント](https://ics-creative.github.io/ParticleJS/docs/)
- [Particle Develop](https://ics-creative.github.io/ParticleJS/)（デザインツール）

## 特徴

1. **GUIデザインツール**: Particle Developで直感的にデザイン
2. **JSON出力**: パラメータをJSON形式で保存・読み込み
3. **クロスブラウザ**: デスクトップ・モバイル両対応
4. **高速**: Canvas描画で大量パーティクル処理

## 基本的な使い方

### 1. ライブラリ読み込み

```html
<!-- CreateJS -->
<script src="https://code.createjs.com/1.0.0/createjs.min.js"></script>

<!-- ParticleJS -->
<script src="https://cdn.rawgit.com/ics-creative/ParticleJS/release/1.0.0/libs/particlejs.min.js"></script>
```

### 2. Canvas要素

```html
<canvas width="960" height="540" id="myCanvas"></canvas>
```

### 3. JavaScript初期化

```javascript
// Stageオブジェクト作成
const stage = new createjs.Stage("myCanvas");

// パーティクルシステム作成
const particleSystem = new particlejs.ParticleSystem();

// 表示リストに登録
stage.addChild(particleSystem.container);

// JSONからパラメータ読み込み
particleSystem.importFromJson({
  "emitFrequency": 300,
  "lifeSpan": "40",
  "lifeSpanVariance": "0",
  // ...
});
```

### 4. アニメーションループ

```javascript
createjs.Ticker.framerate = 60;
createjs.Ticker.on("tick", handleTick);

function handleTick() {
  particleSystem.update();  // パーティクル更新
  stage.update();           // 描画更新
}
```

## JSONパラメータ例

```json
{
  "emitFrequency": 300,      // 発生頻度
  "lifeSpan": "40",          // 寿命
  "lifeSpanVariance": "0",   // 寿命のばらつき
  "startX": 480,             // 発生X座標
  "startY": 270,             // 発生Y座標
  "startXVariance": 0,       // X座標ばらつき
  "startYVariance": 0,       // Y座標ばらつき
  "initialSpeed": 5,         // 初速
  "initialSpeedVariance": 3, // 初速ばらつき
  "initialDirection": 0,     // 初期方向
  "initialDirectionVariance": 360, // 方向ばらつき
  "gravity": 0,              // 重力
  "accelerationSpeed": 0,    // 加速度
  "accelerationDirection": 0,// 加速方向
  "startScale": 1,           // 初期スケール
  "startScaleVariance": 0,   // スケールばらつき
  "finishScale": 0,          // 終了スケール
  "finishScaleVariance": 0,  // 終了スケールばらつき
  "startAlpha": 1,           // 初期透明度
  "startAlphaVariance": 0,   // 透明度ばらつき
  "finishAlpha": 0,          // 終了透明度
  "finishAlphaVariance": 0,  // 終了透明度ばらつき
  "startColor": "#ff0000",   // 初期色
  "finishColor": "#ffff00",  // 終了色
  "blendMode": true,         // 加算合成
  "alphaCurveType": "0"      // アルファカーブ
}
```

## Remotion への移植マッピング

| ParticleJS | Remotion |
|------------|----------|
| emitFrequency | パーティクル総数 |
| lifeSpan | フレーム数に換算 |
| lifeSpanVariance | `random() * variance` |
| startX/Y | 初期位置 |
| startX/YVariance | `random() * variance` |
| initialSpeed | `interpolate()` で位置計算 |
| initialDirection | `Math.cos/sin(direction)` |
| gravity | フレームごとに速度加算 |
| startScale → finishScale | `interpolate(frame, [0, life], [start, finish])` |
| startAlpha → finishAlpha | `interpolate()` で透明度 |
| startColor → finishColor | `interpolateColors()` |
| blendMode | CSS `mix-blend-mode: screen` |

## 応用テクニック

### マウス追随

```javascript
canvas.addEventListener("mousemove", (e) => {
  particleSystem.startX = e.offsetX;
  particleSystem.startY = e.offsetY;
});
```

### 時間経過で色変化

```javascript
let hue = 0;
function handleTick() {
  hue = (hue + 1) % 360;
  particleSystem.startColor = `hsl(${hue}, 100%, 50%)`;
  particleSystem.update();
  stage.update();
}
```

## Remotionでの実装例

```tsx
interface ParticleConfig {
  emitFrequency: number;
  lifeSpan: number;
  startScale: number;
  finishScale: number;
  startAlpha: number;
  finishAlpha: number;
  initialSpeed: number;
  initialDirection: number;
  initialDirectionVariance: number;
  gravity: number;
}

const Particle: React.FC<{
  id: number;
  config: ParticleConfig;
  birthFrame: number;
}> = ({ id, config, birthFrame }) => {
  const frame = useCurrentFrame();
  const age = frame - birthFrame;

  if (age < 0 || age > config.lifeSpan) return null;

  const progress = age / config.lifeSpan;

  // 方向（ランダム）
  const direction = config.initialDirection +
    (random(`dir-${id}`) - 0.5) * config.initialDirectionVariance;
  const rad = (direction * Math.PI) / 180;

  // 位置計算（重力考慮）
  const vx = Math.cos(rad) * config.initialSpeed;
  const vy = Math.sin(rad) * config.initialSpeed + config.gravity * age * 0.5;
  const x = vx * age;
  const y = vy * age;

  // スケール
  const scale = interpolate(
    progress,
    [0, 1],
    [config.startScale, config.finishScale]
  );

  // 透明度
  const alpha = interpolate(
    progress,
    [0, 1],
    [config.startAlpha, config.finishAlpha]
  );

  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        opacity: alpha,
        // ...
      }}
    />
  );
};
```
