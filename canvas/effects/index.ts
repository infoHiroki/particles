/**
 * パーティクルエフェクト 一括エクスポート
 *
 * 20種のエフェクトをカテゴリ別に整理
 */

// UI/UX汎用エフェクト
export { successEffect } from './success';
export { errorEffect } from './error';
export { loadingEffect } from './loading';
export { notificationEffect } from './notification';
export { confettiEffect } from './confetti';
export { clickEffect } from './click';
export { heartbeatEffect } from './heartbeat';
export { rippleEffect } from './ripple';

// 視覚効果・演出系エフェクト
export { fireEffect } from './fire';
export { waterEffect } from './water';
export { electricEffect } from './electric';
export { snowEffect } from './snow';
export { starsEffect } from './stars';
export { smokeEffect } from './smoke';
export { rainEffect } from './rain';
export { fireworksEffect } from './fireworks';
export { meteorEffect } from './meteor';
export { spiralEffect } from './spiral';
export { portalEffect } from './portal';
export { glitchEffect } from './glitch';
export { auroraEffect } from './aurora';
export { matrixEffect } from './matrix';
export { explosionEffect } from './explosion';

// 背景・環境系エフェクト
export { networkEffect } from './network';
export { bubbleEffect } from './bubble';
export { dustEffect } from './dust';
export { sakuraEffect } from './sakura';
export { leavesEffect } from './leaves';
export { fireflyEffect } from './firefly';

// ゲーム系エフェクト
export { levelupEffect } from './levelup';
export { comboEffect } from './combo';
export { criticalEffect } from './critical';
export { shieldEffect } from './shield';
export { healEffect } from './heal';
export { poisonEffect } from './poison';

// エフェクト配列（カテゴリ別）
import { successEffect } from './success';
import { errorEffect } from './error';
import { loadingEffect } from './loading';
import { notificationEffect } from './notification';
import { confettiEffect } from './confetti';
import { clickEffect } from './click';
import { heartbeatEffect } from './heartbeat';
import { rippleEffect } from './ripple';
import { fireEffect } from './fire';
import { waterEffect } from './water';
import { electricEffect } from './electric';
import { snowEffect } from './snow';
import { starsEffect } from './stars';
import { smokeEffect } from './smoke';
import { rainEffect } from './rain';
import { fireworksEffect } from './fireworks';
import { meteorEffect } from './meteor';
import { spiralEffect } from './spiral';
import { portalEffect } from './portal';
import { glitchEffect } from './glitch';
import { auroraEffect } from './aurora';
import { matrixEffect } from './matrix';
import { explosionEffect } from './explosion';
import { networkEffect } from './network';
import { bubbleEffect } from './bubble';
import { dustEffect } from './dust';
import { sakuraEffect } from './sakura';
import { leavesEffect } from './leaves';
import { fireflyEffect } from './firefly';
import { levelupEffect } from './levelup';
import { comboEffect } from './combo';
import { criticalEffect } from './critical';
import { shieldEffect } from './shield';
import { healEffect } from './heal';
import { poisonEffect } from './poison';

import type { Effect } from '../types';

/** UI/UXエフェクト一覧 */
export const uiEffects: Effect[] = [
  successEffect,
  errorEffect,
  loadingEffect,
  notificationEffect,
  confettiEffect,
  clickEffect,
  heartbeatEffect,
  rippleEffect,
];

/** 視覚効果エフェクト一覧 */
export const visualEffects: Effect[] = [
  fireEffect,
  waterEffect,
  electricEffect,
  snowEffect,
  starsEffect,
  smokeEffect,
  rainEffect,
  fireworksEffect,
  meteorEffect,
  spiralEffect,
  portalEffect,
  glitchEffect,
  auroraEffect,
  matrixEffect,
  explosionEffect,
];

/** 背景エフェクト一覧 */
export const backgroundEffects: Effect[] = [
  networkEffect,
  bubbleEffect,
  dustEffect,
  sakuraEffect,
  leavesEffect,
  fireflyEffect,
];

/** ゲームエフェクト一覧 */
export const gameEffects: Effect[] = [
  levelupEffect,
  comboEffect,
  criticalEffect,
  shieldEffect,
  healEffect,
  poisonEffect,
];

/** 全エフェクト一覧 */
export const allEffects: Effect[] = [
  ...uiEffects,
  ...visualEffects,
  ...backgroundEffects,
  ...gameEffects,
];

/** エフェクト名からエフェクトを取得 */
export function getEffectByName(name: string): Effect | undefined {
  return allEffects.find((e) => e.config.name === name);
}

/** カテゴリ名からエフェクト一覧を取得 */
export function getEffectsByCategory(category: string): Effect[] {
  switch (category) {
    case 'ui':
      return uiEffects;
    case 'visual':
      return visualEffects;
    case 'background':
      return backgroundEffects;
    case 'game':
      return gameEffects;
    case 'all':
    default:
      return allEffects;
  }
}
