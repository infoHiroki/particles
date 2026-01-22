# particles.js オプション完全ガイド

参考: [幾何学模様のパーティクルアニメーションが実装できるjsプラグイン「particles.js」の使い方](https://denno-jouhokyoku.jp/blog/2022-06-10/) - 電脳情報局

## 概要

particles.jsは幾何学模様のパーティクルアニメーションを簡単に実装できるJSプラグイン。

- 公式サイト: https://vincentgarreau.com/particles.js/
- GitHub: https://github.com/VincentGarreau/particles.js

## 基本構造

```javascript
particlesJS('particles-js', {
  "particles": { /* パーティクル設定 */ },
  "interactivity": { /* インタラクション設定 */ },
  "retina_detect": true
});
```

## パーティクル設定 (particles)

### 数 (number)

```javascript
"number": {
  "value": 20,           // シェイプの数
  "density": {
    "enable": true,      // 密度を変更する
    "value_area": 1000   // 密集度（大きいほど余白多い）
  }
}
```

### 色 (color)

```javascript
"color": {
  "value": "#ffffff"                    // 単色
  // または
  "value": ["26B7BC", "008FB3", "FAF44B"] // 複数色（配列）
}
```

### 形状 (shape)

```javascript
"shape": {
  "type": "circle",  // 形状タイプ
  "stroke": {
    "width": 0,      // 外線の太さ
    "color": "#000000"
  },
  // polygon（多角形）の場合
  "polygon": {
    "nb_sides": 5    // 角の数
  },
  // image（画像）の場合
  "image": {
    "src": "img/gazou.png",
    "width": 100,
    "height": 100
  }
}
```

**typeの種類**
| type | 説明 |
|------|------|
| circle | 円 |
| edge | 四角形 |
| triangle | 三角形 |
| polygon | 多角形（nb_sidesで角数指定） |
| star | 星 |
| image | 画像指定 |

### 透明度 (opacity)

```javascript
"opacity": {
  "value": 1,        // 透明度（0.1〜1、1で不透明）
  "random": false,   // ランダムにするか
  "anim": {
    "enable": false, // アニメーション有効化
    "speed": 1,      // スピード
    "opacity_min": 0.1,
    "sync": false    // 同時に動かすか
  }
}
```

### サイズ (size)

```javascript
"size": {
  "value": 80,       // 大きさ
  "random": true,    // ランダムにするか
  "anim": {
    "enable": false,
    "speed": 10,
    "size_min": 0.1,
    "sync": false
  }
}
```

### 線で繋ぐ (line_linked)

```javascript
"line_linked": {
  "enable": true,    // 線を表示
  "distance": 150,   // 繋がる距離
  "color": "#ffffff",
  "opacity": 0.4,
  "width": 1
}
```

### 動き (move)

```javascript
"move": {
  "enable": true,
  "speed": 2,           // スピード
  "direction": "none",  // 方向
  "straight": false,    // 直線移動
  "out_mode": "bounce", // 端での挙動
  "attract": {
    "enable": false,
    "rotateX": 600,
    "rotateY": 1200
  }
}
```

**directionの種類**
| direction | 説明 |
|-----------|------|
| none | 方向なし（ランダム） |
| top | 上昇 |
| top-right | 右上 |
| right | 右 |
| bottom-right | 右下 |
| bottom | 下降 |
| bottom-left | 左下 |
| left | 左 |
| top-left | 左上 |

**out_modeの種類**
| out_mode | 説明 |
|----------|------|
| bounce | 跳ね返る |
| out | フレームアウト |

## インタラクション設定 (interactivity)

### イベント (events)

```javascript
"events": {
  "onhover": {
    "enable": true,
    "mode": "repulse"  // ホバー時の動作
  },
  "onclick": {
    "enable": true,
    "mode": "push"     // クリック時の動作
  },
  "resize": true       // リサイズ対応
}
```

### モード (modes)

```javascript
"modes": {
  // カーソルとシェイプ間に線
  "grab": {
    "distance": 400,
    "line_linked": {
      "opacity": 1
    }
  },
  // シェイプが膨らむ
  "bubble": {
    "distance": 200,
    "size": 40,
    "duration": 2,
    "opacity": 8,
    "speed": 3
  },
  // カーソルから逃げる
  "repulse": {
    "distance": 200
  },
  // シェイプを増やす
  "push": {
    "particles_nb": 4
  },
  // シェイプを減らす
  "remove": {
    "particles_nb": 2
  }
}
```

**モード一覧**
| mode | 説明 |
|------|------|
| grab | カーソルとシェイプ間に線 |
| bubble | シェイプが膨らむ |
| repulse | カーソルから逃げる |
| push | シェイプを増やす |
| remove | シェイプを減らす |

## Remotion への移植マッピング

| particles.js | Remotion |
|--------------|----------|
| number.value | パーティクル配列の長さ |
| number.density | 画面サイズに応じて計算 |
| color.value | `hsla()` or `rgba()` |
| shape.type | CSS or SVG |
| opacity.value | CSS `opacity` |
| opacity.anim | `interpolate()` |
| size.value | CSS `width`, `height` |
| size.random | `random()` |
| line_linked | SVG `<line>` + 距離計算 |
| move.speed | フレームごとの位置更新量 |
| move.direction | 初期速度ベクトル |
| move.out_mode | 位置の境界チェック |
| interactivity | Remotionでは不要（プリレンダ） |

## 完全なサンプル設定

```javascript
particlesJS('particles-js', {
  "particles": {
    "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#ffffff" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5, "random": false },
    "size": { "value": 3, "random": true },
    "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
    "move": { "enable": true, "speed": 6, "direction": "none", "out_mode": "out" }
  },
  "interactivity": {
    "events": {
      "onhover": { "enable": true, "mode": "repulse" },
      "onclick": { "enable": true, "mode": "push" }
    },
    "modes": {
      "repulse": { "distance": 100 },
      "push": { "particles_nb": 4 }
    }
  },
  "retina_detect": true
});
```
