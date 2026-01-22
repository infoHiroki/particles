# Unity Particle System ガイド

参考: [パーティクルシステム パーフェクトガイド01](https://note.com/black_box_heros/n/n8b7c9d8e7f6a) - バーチャルヒーロー活動支援組織BLACK BOX

## 概要

虹色に輝くエナジーオーブを作成するチュートリアル。パーティクルシステムの基本設定を網羅。

## 主要パラメータ

### 基本設定

| パラメータ | 説明 | 例 |
|-----------|------|-----|
| Start Lifetime | パーティクルの寿命（秒） | 1.3 |
| Start Size | 初期サイズ | 5 |
| Start Speed | 初速度（0で静止） | 0 |
| Start Rotation | 初期角度 | 0~360 |
| Start Color | 初期色 | Random Color |

### Emission（放出）

| パラメータ | 説明 | 例 |
|-----------|------|-----|
| Rate over Time | 1秒あたりの生成数 | 5 |

### Shape（形状）

| パラメータ | 説明 | 例 |
|-----------|------|-----|
| Shape | 放出形状 | Sphere |
| Radius | 放出位置の大きさ | 0（一点から） |

### Over Lifetime（寿命に応じた変化）

| 設定 | 説明 |
|------|------|
| Color over Lifetime | 透明→不透明→透明でフェードイン/アウト |
| Size over Lifetime | 小→大で拡大しながら出現 |
| Rotation over Lifetime | 回転を与える（-10~10度） |

## テクニック

### Random Between Two Constants
- 2つの値の間でランダムな数値を生成
- 角度: 0~360
- 回転速度: -10~10

### じわっと現れ、じわっと消える
- Color over Lifetime で透明度を制御
- 両端のAlphaを0、中央を255

### 拡大しながら現れる
- Size over Lifetime のグラフを調整
- 左下から右上への曲線

### ランダムカラー
- Start Color → Random Color
- グラデーションで虹色を設定

## Remotion への移植マッピング

| Unity | Remotion |
|-------|----------|
| Start Lifetime | `durationInFrames / fps` |
| Start Size | CSS `width`, `height` or `scale` |
| Start Speed | `interpolate(frame, [0, duration], [startPos, endPos])` |
| Start Rotation | `random('rotation-' + id) * 360` |
| Emission Rate | `Array.from({ length: rate * lifetime })` |
| Shape: Sphere | `x = cos(angle) * radius`, `y = sin(angle) * radius` |
| Color over Lifetime | `interpolate(frame, [...], ['rgba(...)'])` |
| Size over Lifetime | `spring()` or `interpolate()` |
| Rotation over Lifetime | `rotation + frame * rotationSpeed` |
| Random Between Two | `min + random(seed) * (max - min)` |

## サンプルコード（Remotion）

```tsx
// パーティクル1個の基本構造
const Particle: React.FC<{ id: number; delay: number }> = ({ id, delay }) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delay;
  if (activeFrame < 0) return null;

  const lifetime = 39; // 1.3秒 @ 30fps
  const progress = activeFrame / lifetime;

  // フェードイン/アウト
  const opacity = progress < 0.5
    ? progress * 2
    : (1 - progress) * 2;

  // サイズ変化
  const size = spring({
    frame: activeFrame,
    fps: 30,
    config: { damping: 15 },
  }) * 100;

  // 回転
  const rotation = random(`rot-${id}`) * 360 + activeFrame * 3;

  // 色（虹色からランダム）
  const hue = random(`hue-${id}`) * 360;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `hsla(${hue}, 80%, 60%, ${opacity})`,
        transform: `rotate(${rotation}deg)`,
        // ...
      }}
    />
  );
};
```

## 参考リンク

- [Unity Particle System Manual](https://docs.unity3d.com/Manual/PartSysReference.html)
- [Remotion Docs](https://www.remotion.dev/docs/)
