# CSSパーティクル実装テクニック 8実例

参考: [8つの実例で学ぶCSSにおけるパーティクルの手法](https://japanc-more.rssing.com/chan-16988061/article3166.html) - Japanシーモア

## 概要

CSS（とJS）を使ったパーティクル効果の基本から応用まで。HTMLとCSSだけで実現できるパーティクル表現を学ぶ。

## 基本概念

パーティクル効果を作成するには：
1. HTMLでパーティクル要素を定義
2. CSSでスタイルと動きを指定
3. `@keyframes` でアニメーション定義

## サンプル1: 単純なパーティクル

```html
<div class="particle"></div>
```

```css
.particle {
  width: 10px;
  height: 10px;
  background-color: red;
  position: absolute;
  top: 50%;
  left: 50%;
}
```

## サンプル2: 色とサイズの変更

```css
.particle {
  width: 20px;
  height: 20px;
  background-color: blue;
  border-radius: 50%; /* 円形 */
}
```

## サンプル3: パーティクルの動きアニメーション

```css
.particle {
  width: 10px;
  height: 10px;
  background-color: blue;
  position: absolute;
  animation: move 5s infinite;
}

@keyframes move {
  0%   { top: 0; left: 0; }
  25%  { top: 0; left: 100%; }
  50%  { top: 100%; left: 100%; }
  75%  { top: 100%; left: 0; }
  100% { top: 0; left: 0; }
}
```

## サンプル4: 複数パーティクルの同時アニメーション

```html
<div class="particle" id="particle1"></div>
<div class="particle" id="particle2"></div>
<div class="particle" id="particle3"></div>
```

```css
#particle1 { animation: move1 5s infinite; }
#particle2 { animation: move2 5s infinite; }
#particle3 { animation: move3 5s infinite; }

@keyframes move1 {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(100px, 50px); }
}

@keyframes move2 {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(-50px, 100px); }
}

@keyframes move3 {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(80px, -60px); }
}
```

## サンプル5: ユーザーアクションに反応するパーティクル

```html
<div class="interactive-particle"></div>
```

```css
.interactive-particle {
  width: 10px;
  height: 10px;
  background-color: red;
  position: absolute;
  transition: transform 1s;
}
```

```javascript
document.addEventListener('mousemove', function(e) {
  var particle = document.querySelector('.interactive-particle');
  particle.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});
```

## サンプル6: テキストとのインタラクション

```html
<div class="text">Hover Me</div>
<div class="text-particle"></div>
```

```css
.text {
  position: relative;
  display: inline-block;
}

.text-particle {
  width: 10px;
  height: 10px;
  background-color: green;
  position: absolute;
  transition: transform 1s;
}
```

```javascript
document.querySelector('.text').addEventListener('mouseover', function(e) {
  var particle = document.querySelector('.text-particle');
  var textRect = e.target.getBoundingClientRect();
  particle.style.transform = `translate(${textRect.left}px, ${textRect.top}px)`;
});
```

## サンプル7: パーティクル背景効果

```html
<div class="background-particle"></div>
```

```css
.background-particle {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.background-particle::after {
  content: '';
  display: block;
  width: 2px;
  height: 2px;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  animation: moveBackground 10s infinite;
}

@keyframes moveBackground {
  0%   { transform: translate(-50%, -50%); }
  100% { transform: translate(50%, 50%); }
}
```

## サンプル8: ナビゲーションバーのパーティクル

```html
<nav class="navbar">
  <ul>
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
```

```css
.navbar ul {
  list-style: none;
  display: flex;
}

.navbar li {
  margin: 0 10px;
  position: relative;
}

.navbar a {
  text-decoration: none;
  color: black;
}

.navbar li::after {
  content: '';
  display: block;
  width: 5px;
  height: 5px;
  background-color: blue;
  border-radius: 50%;
  position: absolute;
  bottom: -10px;
  left: 50%;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
}

.navbar li:hover::after {
  opacity: 1;
  transform: translateY(10px);
}
```

## 注意点

### ブラウザ互換性とパフォーマンス

- 過度のパーティクル使用はページ読み込み速度に影響
- ブラウザ互換性を常に確認
- フォールバックスタイルを用意

### レスポンシブ対応

```css
/* スマホでパーティクル数を減らす */
@media (max-width: 768px) {
  .particle:nth-child(n+5) {
    display: none;
  }
}
```

## カスタマイズ例

### 奇数・偶数で色を変える

```css
.particle {
  width: 10px;
  height: 10px;
  position: absolute;
  border-radius: 50%;
  animation: move 5s infinite;
}

.particle:nth-child(odd) {
  background-color: blue;
}

.particle:nth-child(even) {
  background-color: red;
}
```

### マウス軌跡パーティクル

```javascript
document.addEventListener('mousemove', function(e) {
  var particle = document.createElement('div');
  particle.className = 'mouse-particle';
  document.body.appendChild(particle);

  particle.style.left = e.clientX + 'px';
  particle.style.top = e.clientY + 'px';

  setTimeout(function() {
    particle.remove();
  }, 1000);
});
```

```css
.mouse-particle {
  width: 5px;
  height: 5px;
  background-color: rgba(255, 100, 100, 0.8);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  animation: fadeOut 1s forwards;
}

@keyframes fadeOut {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0); }
}
```

## Remotion への適用

| CSS | Remotion |
|-----|----------|
| `@keyframes` | `interpolate()` + フレーム計算 |
| `animation-duration` | `durationInFrames` |
| `animation-delay` | `<Sequence from={...}>` |
| `transition` | `spring()` |
| `:hover`, `:nth-child` | Reactコンポーネントのprops |
| `::after` | 子コンポーネント |

### CSS → Remotion 変換例

```tsx
// CSSのanimation: move 5s infinite; を Remotion で再現
const Particle: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const duration = 5 * fps; // 5秒 = 150フレーム @ 30fps
  const loopFrame = frame % duration;
  const progress = loopFrame / duration;

  // @keyframes move の再現
  const positions = [
    { top: 0, left: 0 },      // 0%
    { top: 0, left: 100 },    // 25%
    { top: 100, left: 100 },  // 50%
    { top: 100, left: 0 },    // 75%
    { top: 0, left: 0 },      // 100%
  ];

  const segment = Math.floor(progress * 4);
  const segmentProgress = (progress * 4) % 1;

  const from = positions[segment];
  const to = positions[segment + 1] || positions[0];

  const top = from.top + (to.top - from.top) * segmentProgress;
  const left = from.left + (to.left - from.left) * segmentProgress;

  return (
    <div
      style={{
        width: 10,
        height: 10,
        backgroundColor: index % 2 === 0 ? 'blue' : 'red',
        borderRadius: '50%',
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
      }}
    />
  );
};
```
