/**
 * パーティクルシステム共通型定義
 */

/** パーティクルの基本インターフェース */
export interface Particle {
  /** 一意識別子 */
  id: string;
  /** X座標 */
  x: number;
  /** Y座標 */
  y: number;
  /** パーティクルの種類 */
  type: string;
  /** 進行度 (0〜maxProgress) */
  progress: number;
  /** 最大進行度 */
  maxProgress: number;
  /** 透明度 (0〜1) */
  alpha: number;
  /** 遅延フレーム数 */
  delay?: number;
  /** 追加プロパティ */
  [key: string]: unknown;
}

/** 円形パーティクル */
export interface CircleParticle extends Particle {
  type: 'circle';
  radius: number;
  color: string;
  angle?: number;
  distance?: number;
}

/** リングパーティクル */
export interface RingParticle extends Particle {
  type: 'ring';
  radius: number;
  color: string;
  lineWidth: number;
}

/** 線パーティクル */
export interface LineParticle extends Particle {
  type: 'line';
  angle: number;
  length: number;
  color: string;
  lineWidth: number;
}

/** 星形パーティクル */
export interface StarParticle extends Particle {
  type: 'star';
  radius: number;
  points: number;
  color: string;
  rotation?: number;
  innerRatio?: number;
}

/** テキストパーティクル */
export interface TextParticle extends Particle {
  type: 'text';
  text: string;
  fontSize: number;
  color: string;
  fontFamily?: string;
}

/** 矩形パーティクル */
export interface RectParticle extends Particle {
  type: 'rect';
  width: number;
  height: number;
  color: string;
  rotation?: number;
}

/** 画像パーティクル */
export interface ImageParticle extends Particle {
  type: 'image';
  image: HTMLImageElement | string;
  width: number;
  height: number;
  rotation?: number;
}

/** パーティクルユニオン型 */
export type AnyParticle =
  | CircleParticle
  | RingParticle
  | LineParticle
  | StarParticle
  | TextParticle
  | RectParticle
  | ImageParticle
  | Particle;

/** エフェクト設定 */
export interface EffectConfig {
  /** エフェクト名 */
  name: string;
  /** 説明 */
  description?: string;
  /** デフォルトの色 */
  colors?: string[];
  /** デフォルトの強度 (0〜1) */
  intensity?: number;
  /** 継続時間倍率 */
  durationScale?: number;
}

/** エフェクトインターフェース */
export interface Effect {
  /** エフェクト設定 */
  config: EffectConfig;
  /** パーティクル生成 */
  create(x: number, y: number, options?: EffectOptions): Particle[];
  /** パーティクル更新 */
  update(particle: Particle, deltaTime: number): Particle | null;
  /** パーティクル描画 */
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void;
}

/** エフェクトオプション */
export interface EffectOptions {
  /** 色配列のオーバーライド */
  colors?: string[];
  /** 強度 (0〜1) */
  intensity?: number;
  /** 継続時間倍率 */
  durationScale?: number;
  /** 追加パラメータ */
  [key: string]: unknown;
}

/** パーティクルシステム設定 */
export interface SystemConfig {
  /** キャンバス幅 */
  width: number;
  /** キャンバス高さ */
  height: number;
  /** 時間倍率（大きいほど長く表示） */
  timeScale?: number;
  /** 背景色（null で透明） */
  backgroundColor?: string | null;
  /** FPS表示 */
  showFps?: boolean;
  /** パーティクル数表示 */
  showParticleCount?: boolean;
}

/** イージング関数の型 */
export type EasingFunction = (t: number) => number;

/** カラーRGBA */
export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** カラーHSLA */
export interface HSLA {
  h: number;
  s: number;
  l: number;
  a: number;
}

/** ベクトル2D */
export interface Vector2 {
  x: number;
  y: number;
}

/** 矩形 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
