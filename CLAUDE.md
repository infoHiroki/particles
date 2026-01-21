# particles

パーティクルエフェクト集。いろんな種類のパーティクルをコンポーネント化して管理。

## 用途

- ANEWアプリ（Expo Go / React Native）
- frame-busters
- その他プロジェクト

## 技術スタック

- Canvas + JavaScript/TypeScript
- SVG
- Three.js（3D）
- CSS animations
- React Native対応
- ClojureScript + shadow-cljs

## ディレクトリ構成

```
particles/
├── CLAUDE.md
├── canvas/          # Canvas系パーティクル
├── svg/             # SVG系パーティクル
├── threejs/         # Three.js系パーティクル
├── css/             # CSSアニメーション系
├── react-native/    # React Native用
├── cljs/            # ClojureScript + Canvas
└── examples/        # デモ・サンプル
```

## パーティクル一覧

### React Native (SVG)

| 名前 | 説明 | 元 |
|------|------|-----|
| DamageEffectSvg | ダメージエフェクト | BrainBusters |
| DefeatEffectSvg | 敗北エフェクト | BrainBusters |
| BlockEffectSvg | ブロックエフェクト | BrainBusters |
| HealEffectSvg | 回復エフェクト | BrainBusters |
| BuffEffectSvg | バフエフェクト | BrainBusters |
| DebuffEffectSvg | デバフエフェクト | BrainBusters |
| CardPlayEffectSvg | カードプレイエフェクト | BrainBusters |
| PsychedelicEffect | サイケデリックエフェクト | BrainBusters |

### Canvas

| 名前 | 説明 |
|------|------|
| - | - |

### ClojureScript (Canvas)

| 名前 | 説明 | ファイル |
|------|------|---------|
| DamageEffect | ダメージエフェクト | cljs/src/particles/effects/damage.cljs |
| HealEffect | 回復エフェクト | cljs/src/particles/effects/heal.cljs |
| BlockEffect | ブロックエフェクト | cljs/src/particles/effects/block.cljs |
| BuffEffect | バフエフェクト | cljs/src/particles/effects/buff.cljs |
| DebuffEffect | デバフエフェクト | cljs/src/particles/effects/debuff.cljs |
| DefeatEffect | 敵撃破エフェクト | cljs/src/particles/effects/defeat.cljs |
| CardPlayEffect | カードプレイエフェクト | cljs/src/particles/effects/cardplay.cljs |
| PsychedelicEffect | サイケデリックエフェクト | cljs/src/particles/effects/psychedelic.cljs |

#### 開発方法

```bash
cd cljs
npm install
npm run dev
# http://localhost:8080 を開く
```

### Three.js

| 名前 | 説明 |
|------|------|
| - | - |
