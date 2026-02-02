/**
 * ユーティリティ関数
 * - イージング関数
 * - カラー操作
 * - 乱数ユーティリティ
 */

import type { EasingFunction, RGBA, HSLA, Vector2 } from './types';

// ============================================================
// イージング関数
// ============================================================

/** 線形補間 */
export const linear: EasingFunction = (t) => t;

/** イーズイン（二次） */
export const easeInQuad: EasingFunction = (t) => t * t;

/** イーズアウト（二次） */
export const easeOutQuad: EasingFunction = (t) => 1 - (1 - t) * (1 - t);

/** イーズインアウト（二次） */
export const easeInOutQuad: EasingFunction = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/** イーズイン（三次） */
export const easeInCubic: EasingFunction = (t) => t * t * t;

/** イーズアウト（三次） */
export const easeOutCubic: EasingFunction = (t) => 1 - Math.pow(1 - t, 3);

/** イーズインアウト（三次） */
export const easeInOutCubic: EasingFunction = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** イーズイン（四次） */
export const easeInQuart: EasingFunction = (t) => t * t * t * t;

/** イーズアウト（四次） */
export const easeOutQuart: EasingFunction = (t) => 1 - Math.pow(1 - t, 4);

/** イーズインアウト（四次） */
export const easeInOutQuart: EasingFunction = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

/** イーズイン（指数） */
export const easeInExpo: EasingFunction = (t) =>
  t === 0 ? 0 : Math.pow(2, 10 * t - 10);

/** イーズアウト（指数） */
export const easeOutExpo: EasingFunction = (t) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/** イーズインアウト（指数） */
export const easeInOutExpo: EasingFunction = (t) =>
  t === 0
    ? 0
    : t === 1
    ? 1
    : t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;

/** イーズイン（サイン） */
export const easeInSine: EasingFunction = (t) =>
  1 - Math.cos((t * Math.PI) / 2);

/** イーズアウト（サイン） */
export const easeOutSine: EasingFunction = (t) => Math.sin((t * Math.PI) / 2);

/** イーズインアウト（サイン） */
export const easeInOutSine: EasingFunction = (t) =>
  -(Math.cos(Math.PI * t) - 1) / 2;

/** イーズアウト（バウンス） */
export const easeOutBounce: EasingFunction = (t) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

/** イーズイン（バウンス） */
export const easeInBounce: EasingFunction = (t) => 1 - easeOutBounce(1 - t);

/** イーズイン（バック - オーバーシュート） */
export const easeInBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
};

/** イーズアウト（バック - オーバーシュート） */
export const easeOutBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** イーズアウト（エラスティック - ばねのような動き） */
export const easeOutElastic: EasingFunction = (t) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

// イージング関数のマップ
export const easings = {
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
} as const;

// ============================================================
// カラー操作
// ============================================================

/** HEXをRGBAに変換 */
export function hexToRgba(hex: string): RGBA {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(
    hex
  );
  if (!result) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: result[4] ? parseInt(result[4], 16) / 255 : 1,
  };
}

/** RGBAをHEXに変換 */
export function rgbaToHex(rgba: RGBA): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}`;
}

/** RGBAをCSS文字列に変換 */
export function rgbaToCss(rgba: RGBA): string {
  return `rgba(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)}, ${rgba.a})`;
}

/** HSLAをRGBAに変換 */
export function hslaToRgba(hsla: HSLA): RGBA {
  const { h, s, l, a } = hsla;
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  let r: number, g: number, b: number;

  if (sNorm === 0) {
    r = g = b = lNorm;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a,
  };
}

/** RGBAをHSLAに変換 */
export function rgbaToHsla(rgba: RGBA): HSLA {
  const r = rgba.r / 255;
  const g = rgba.g / 255;
  const b = rgba.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: rgba.a,
  };
}

/** 色を補間 */
export function lerpColor(color1: string, color2: string, t: number): string {
  const rgba1 = hexToRgba(color1);
  const rgba2 = hexToRgba(color2);
  return rgbaToCss({
    r: rgba1.r + (rgba2.r - rgba1.r) * t,
    g: rgba1.g + (rgba2.g - rgba1.g) * t,
    b: rgba1.b + (rgba2.b - rgba1.b) * t,
    a: rgba1.a + (rgba2.a - rgba1.a) * t,
  });
}

/** 色を明るく */
export function lighten(color: string, amount: number): string {
  const rgba = hexToRgba(color);
  const hsla = rgbaToHsla(rgba);
  hsla.l = Math.min(100, hsla.l + amount);
  return rgbaToCss(hslaToRgba(hsla));
}

/** 色を暗く */
export function darken(color: string, amount: number): string {
  const rgba = hexToRgba(color);
  const hsla = rgbaToHsla(rgba);
  hsla.l = Math.max(0, hsla.l - amount);
  return rgbaToCss(hslaToRgba(hsla));
}

/** 透明度を適用 */
export function withAlpha(color: string, alpha: number): string {
  const rgba = hexToRgba(color);
  rgba.a = alpha;
  return rgbaToCss(rgba);
}

// ============================================================
// 乱数ユーティリティ
// ============================================================

/** 範囲内のランダム値 */
export function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** 範囲内のランダム整数 */
export function randomInt(min: number, max: number): number {
  return Math.floor(random(min, max + 1));
}

/** 配列からランダムに選択 */
export function randomPick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/** 配列からランダムにN個選択 */
export function randomPickN<T>(array: T[], n: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/** 重み付きランダム選択 */
export function weightedPick<T>(items: { value: T; weight: number }[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item.value;
  }
  return items[0].value;
}

/** 偏りのあるランダム（小さい値に集中） */
export function biasedRandomLow(min: number, max: number, bias = 2): number {
  const r = Math.pow(Math.random(), bias);
  return min + r * (max - min);
}

/** 偏りのあるランダム（大きい値に集中） */
export function biasedRandomHigh(min: number, max: number, bias = 2): number {
  const r = 1 - Math.pow(Math.random(), bias);
  return min + r * (max - min);
}

/** 正規分布に近いランダム */
export function gaussianRandom(mean = 0, stdDev = 1): number {
  // Box-Muller変換
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * stdDev + mean;
}

/** ランダムな角度（ラジアン） */
export function randomAngle(): number {
  return Math.random() * Math.PI * 2;
}

/** ランダムな方向ベクトル */
export function randomDirection(): Vector2 {
  const angle = randomAngle();
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}

// ============================================================
// ベクトル操作
// ============================================================

/** ベクトルの長さ */
export function vectorLength(v: Vector2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/** ベクトルの正規化 */
export function vectorNormalize(v: Vector2): Vector2 {
  const len = vectorLength(v);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

/** ベクトルの加算 */
export function vectorAdd(v1: Vector2, v2: Vector2): Vector2 {
  return { x: v1.x + v2.x, y: v1.y + v2.y };
}

/** ベクトルのスケール */
export function vectorScale(v: Vector2, scale: number): Vector2 {
  return { x: v.x * scale, y: v.y * scale };
}

/** 角度からベクトルを作成 */
export function angleToVector(angle: number): Vector2 {
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

/** ベクトルから角度を取得 */
export function vectorToAngle(v: Vector2): number {
  return Math.atan2(v.y, v.x);
}

// ============================================================
// 補間・その他
// ============================================================

/** 線形補間 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 値を範囲にクランプ */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** 値を範囲にマッピング */
export function map(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/** ユニークID生成 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/** 度からラジアンへ変換 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** ラジアンから度へ変換 */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}
