# 幾何学パーティクル（ネットワーク系）ガイド

参考: [幾何学な動きをするパーティクルの作り方](https://o-two.jp/blog/web/2022-04-27/) - オーツースタッフブログ

## 概要

パーティクル同士が近づいたら線で繋ぐネットワーク系エフェクト。particles.js風の実装。

## 仕様

- パーティクル同士が一定距離内で線を描画
- 距離に応じて線の透明度が変化
- 画面端で跳ね返り
- リサイズ対応（パーティクル数を動的調整）

## パラメータ

```javascript
const ratio = 10;   // 画面に表示するパーティクル数の計算に利用
const min = 0.3;    // 移動スピードの最小値
const max = 2;      // 移動スピードの最大値
const dist = 200;   // 線で繋がるまでの距離
```

## パーティクルのデータ構造

```javascript
{
  position: {   // 現在位置
    x: random(0, canvas.width),
    y: random(0, canvas.height)
  },
  direction: {  // 進行方向（速度）
    x: random(min, max) * randomSign(),
    y: random(min, max) * randomSign()
  },
  circle: 2     // パーティクルの半径
}
```

## 核心ロジック

### 1. パーティクル数の計算（リサイズ対応）

```javascript
intParticle = Math.floor((canvas.width / 300 * ratio) + (canvas.height / 300 * ratio));
```

画面サイズに応じてパーティクル数を調整。

### 2. 移動と跳ね返り

```javascript
// 位置更新
particle.position.x += particle.direction.x;
particle.position.y += particle.direction.y;

// 画面端で方向反転
if (position.x < 0 || position.x > canvas.width) {
  particle.direction.x *= -1;
}
if (position.y < 0 || position.y > canvas.height) {
  particle.direction.y *= -1;
}
```

### 3. 線で繋ぐ（距離判定）

```javascript
for (let i = 0; i < particles.length; i++) {
  for (let j = 0; j < particles.length; j++) {
    if (i !== j) {
      // マンハッタン距離で判定（計算コスト低）
      const distance = Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);

      if (distance < dist) {
        // 距離に応じて透明度を計算
        const alpha = (dist - distance) / dist;

        // 線を描画
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
}
```

### 4. requestAnimationFrame

```javascript
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // パーティクル描画・更新
  // ...

  requestAnimationFrame(draw);
}

// プレフィックス対応
var requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         function(callback) {
           window.setTimeout(callback, 1000 / 60);
         };
})();
```

## Remotion への移植

### 距離計算の最適化

```tsx
// ユークリッド距離（正確だが重い）
const euclidean = Math.sqrt((x2-x1)**2 + (y2-y1)**2);

// マンハッタン距離（高速、記事で使用）
const manhattan = Math.abs(x2-x1) + Math.abs(y2-y1);
```

### Remotion実装例

```tsx
import { AbsoluteFill, useCurrentFrame, random } from "remotion";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const PARTICLE_COUNT = 50;
const LINE_DISTANCE = 150;

// 初期パーティクル生成（決定論的）
const initParticles = (): Particle[] => {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: random(`x-${i}`) * 1920,
    y: random(`y-${i}`) * 1080,
    vx: (random(`vx-${i}`) - 0.5) * 4,
    vy: (random(`vy-${i}`) - 0.5) * 4,
  }));
};

const particles = initParticles();

// フレームごとの位置計算
const getPosition = (p: Particle, frame: number) => {
  let x = p.x;
  let y = p.y;

  for (let f = 0; f < frame; f++) {
    x += p.vx;
    y += p.vy;

    // 跳ね返り
    if (x < 0 || x > 1920) p.vx *= -1;
    if (y < 0 || y > 1080) p.vy *= -1;
  }

  return { x: x % 1920, y: y % 1080 };
};

export const NetworkParticles: React.FC = () => {
  const frame = useCurrentFrame();

  // 現在フレームの位置を計算
  const positions = particles.map(p => ({
    ...p,
    ...getPosition(p, frame),
  }));

  // 線を描画するペアを計算
  const lines: { x1: number; y1: number; x2: number; y2: number; alpha: number }[] = [];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dist = Math.abs(positions[i].x - positions[j].x) +
                   Math.abs(positions[i].y - positions[j].y);

      if (dist < LINE_DISTANCE) {
        lines.push({
          x1: positions[i].x,
          y1: positions[i].y,
          x2: positions[j].x,
          y2: positions[j].y,
          alpha: 1 - dist / LINE_DISTANCE,
        });
      }
    }
  }

  return (
    <AbsoluteFill style={{ background: "#0a0a15" }}>
      {/* 線 */}
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={`rgba(255,255,255,${line.alpha})`}
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* パーティクル */}
      {positions.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.x - 3,
            top: p.y - 3,
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "white",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
```

## 注意点

### パフォーマンス

- O(n²) の距離計算が重い
- 対策: 空間分割（グリッド、四分木）
- Remotionではプリレンダリングなので許容範囲広い

### Remotionの決定論性

- `random()` はシード付きで決定論的
- フレームごとに同じ結果が保証される
- Canvas版のような状態保持は不要

## 関連ライブラリ

- [particles.js](https://vincentgarreau.com/particles.js/) - 元祖ネットワークパーティクル
- [tsparticles](https://particles.js.org/) - particles.jsの後継
