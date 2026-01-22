# パーティクル表現デザインテクニック

参考: [センスだけに頼らない！CSSとJSで作るパーティクル表現のテクニック](https://ics.media/entry/220420/) - ICS MEDIA

## 概要

効果的なパーティクル表現を作るためのデザインテクニック集。センスに頼らず、ロジックで「映える」表現を作る方法。

## 基本テクニック

### 1. 数を増やす＆ランダムにする

最も簡単で効果的な方法。

```javascript
const angle = 360 * Math.random();      // 角度
const dist = 100 + Math.random() * 50;  // 飛距離 100〜150
const size = 0.5 + Math.random() * 2;   // サイズ 0.5〜2.5
const hue = 30 + Math.random() * 25;    // 色相 30〜55
```

**注意点**
- やりすぎない
- 全体のバランスを見ながら調整

### 2. 透明度・ブラー・合成モードで派手さを足す

```javascript
// ブレンドモード（加算合成）
dot.style.mixBlendMode = "screen"; // or "add"

// ブラー
dot.style.filter = `blur(${Math.random() * 20}px)`;
```

**効果的な使い方**
- 激しさより上品さを演出したい時
- ゆったりした動き + 長めのフェードアウト

**注意点**
- `mix-blend-mode` と `filter` は負荷が高い
- やりすぎるとパフォーマンスに影響

## 応用テクニック

### 1. 少ない要素で動きにメリハリをつける

**予備動作と余韻が重要**
- 動き始める前の「溜め」
- 動いた後の余韻

```javascript
// 放射状に広がりながらドットを引き伸ばす
[
  {
    transform: `rotate(${angle}deg) translateX(0px) scaleX(1)`,
    opacity: 1,
    easing: 'ease-out'
  },
  {
    transform: `rotate(${angle}deg) translateX(${dist * 0.9}px) scaleX(${len})`,
    opacity: 1,
    offset: 0.6,  // 60%の位置
    easing: 'ease-in'
  },
  {
    transform: `rotate(${angle}deg) translateX(${dist}px) scaleX(1)`,
    opacity: 1,
  }
]
```

**ポイント: バラすところと揃えるところを明確に**
- ランダム: タイミング、引き伸ばし度合い
- 揃える: 角度、最後のフェードタイミング

### 2. 「ちょうどいい」ランダムさを意識的に作る

完全なランダムは意外と偏りがある。10個のドットを配置しても、きれいに散らばるとは限らない。

#### 手法A: 出現率表

レアなものほど出現率を下げる。

```javascript
const colorTable = [
  { color: 'yellow', weight: 70 },  // 70%
  { color: 'orange', weight: 20 },  // 20%
  { color: 'red', weight: 10 }      // 10%（レア）
];

function pickByWeight(table) {
  const total = table.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * total;
  for (const item of table) {
    random -= item.weight;
    if (random <= 0) return item.color;
  }
  return table[0].color;
}
```

#### 手法B: 基準値の周辺に偏った乱数

ほとんどが基準値付近、たまに外れ値。

```javascript
// ほとんどが0で、まれに1に近い数になる
const distRandom = (Math.random() * Math.random()) ** 1.5;

// 飛距離: ほとんどが100付近、稀に160に近い
const dist = 100 + distRandom * 60;
```

**乱数の補正パターン**

| パターン | 式 | 分布 |
|----------|-----|------|
| 中央に集中 | `(r1 + r2) / 2` | 0.5付近に集中 |
| 小さい値に集中 | `r * r` | 0付近に集中 |
| 極端な値に集中 | `r < 0.5 ? r*2 : 1` | 両端に集中 |

#### 手法C: 確率ではなく個数を決める

```javascript
// 配列からランダムにcount個選ぶ
const pickRandom = (sources, count) => {
  const shuffled = [...sources]
    .map(item => ({ order: Math.random(), item }))
    .sort((a, b) => a.order - b.order)
    .map(wrapper => wrapper.item);
  shuffled.length = count;
  return shuffled;
};

// 使用例
const bigDots = pickRandom(dots, Math.round(COUNT * 0.2));      // 大きいドット: 2割
const borderDots = pickRandom(dots, Math.round(COUNT * 0.2));   // 白抜き: 2割
const afterImageDots = pickRandom(dots, Math.round(COUNT * 0.3)); // 残像: 3割
```

## Remotion への適用

### Web Animations API → Remotion

| Web Animations API | Remotion |
|--------------------|----------|
| `element.animate()` | コンポーネント + `interpolate()` |
| `duration` | `durationInFrames / fps` |
| `delay` | `<Sequence from={delay}>` |
| `easing` | `spring()` or Easing functions |
| `offset` | `interpolate()` の inputRange |
| `fill: "forwards"` | 最終値を保持 |

### イージング関数

```tsx
import { Easing, interpolate } from "remotion";

// ease-out
const value = interpolate(
  frame,
  [0, 30],
  [0, 100],
  { easing: Easing.out(Easing.ease) }
);

// ease-in
const value = interpolate(
  frame,
  [0, 30],
  [0, 100],
  { easing: Easing.in(Easing.ease) }
);
```

### 偏った乱数をRemotionで

```tsx
import { random } from "remotion";

// 基準値の周辺に偏った乱数
const biasedRandom = (seed: string) => {
  const r = random(seed);
  return (r * r) ** 1.5; // 小さい値に集中
};

// 出現率表
const pickByWeight = (seed: string, table: { value: any; weight: number }[]) => {
  const total = table.reduce((sum, item) => sum + item.weight, 0);
  let r = random(seed) * total;
  for (const item of table) {
    r -= item.weight;
    if (r <= 0) return item.value;
  }
  return table[0].value;
};
```

### 個数を決めてランダムに選ぶ

```tsx
const pickRandomN = <T,>(items: T[], count: number, seedPrefix: string): T[] => {
  const shuffled = items
    .map((item, i) => ({ order: random(`${seedPrefix}-${i}`), item }))
    .sort((a, b) => a.order - b.order)
    .map(w => w.item);
  return shuffled.slice(0, count);
};

// 使用例
const bigParticles = pickRandomN(particles, Math.round(COUNT * 0.2), 'big');
```

## デザインチェックリスト

- [ ] 数は適切か（多すぎ/少なすぎ）
- [ ] ランダムと揃える部分のバランスは良いか
- [ ] 予備動作（溜め）はあるか
- [ ] 余韻（フェードアウト）は適切か
- [ ] レアな要素は本当にレアか
- [ ] 偏りが気になる場合は乱数を補正したか
- [ ] パフォーマンスに問題ないか（特にblur, blend-mode）
