/**
 * Canvas Particle System
 * TypeScriptによるパーティクルエフェクトシステム
 *
 * @example
 * ```typescript
 * import { ParticleSystem, allEffects } from './canvas';
 *
 * const canvas = document.getElementById('canvas') as HTMLCanvasElement;
 * const system = new ParticleSystem(canvas, { width: 800, height: 600 });
 *
 * // 全エフェクトを登録
 * system.registerEffects(allEffects);
 *
 * // エフェクトをトリガー
 * system.setCurrentEffect('success');
 * system.enableClickTrigger();
 * system.start();
 * ```
 */

// コアシステム
export { ParticleSystem } from './core';
export {
  drawCircle,
  drawRing,
  drawLine,
  drawStar,
  drawRect,
  drawText,
  drawGradientCircle,
  drawHexagon,
  drawEllipse,
} from './core';

// 型定義
export type {
  Particle,
  CircleParticle,
  RingParticle,
  LineParticle,
  StarParticle,
  TextParticle,
  RectParticle,
  ImageParticle,
  AnyParticle,
  Effect,
  EffectConfig,
  EffectOptions,
  SystemConfig,
  EasingFunction,
  RGBA,
  HSLA,
  Vector2,
  Rect,
} from './types';

// ユーティリティ
export {
  // イージング関数
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeOutBounce,
  easeInBounce,
  easeInBack,
  easeOutBack,
  easeOutElastic,
  easings,
  // カラー
  hexToRgba,
  rgbaToHex,
  rgbaToCss,
  hslaToRgba,
  rgbaToHsla,
  lerpColor,
  lighten,
  darken,
  withAlpha,
  // 乱数
  random,
  randomInt,
  randomPick,
  randomPickN,
  weightedPick,
  biasedRandomLow,
  biasedRandomHigh,
  gaussianRandom,
  randomAngle,
  randomDirection,
  // ベクトル
  vectorLength,
  vectorNormalize,
  vectorAdd,
  vectorScale,
  angleToVector,
  vectorToAngle,
  // 補間・その他
  lerp,
  clamp,
  map,
  generateId,
  degToRad,
  radToDeg,
} from './utils';

// エフェクト
export {
  // UI/UX
  successEffect,
  errorEffect,
  loadingEffect,
  notificationEffect,
  confettiEffect,
  clickEffect,
  // Visual
  fireEffect,
  waterEffect,
  electricEffect,
  snowEffect,
  starsEffect,
  smokeEffect,
  // Background
  networkEffect,
  bubbleEffect,
  dustEffect,
  sakuraEffect,
  // Game
  levelupEffect,
  comboEffect,
  criticalEffect,
  shieldEffect,
  // Collections
  uiEffects,
  visualEffects,
  backgroundEffects,
  gameEffects,
  allEffects,
  // Helpers
  getEffectByName,
  getEffectsByCategory,
} from './effects';
