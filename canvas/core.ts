/**
 * パーティクルシステムコア
 * - パーティクルの生成・更新・描画ループを管理
 */

import type { Particle, Effect, SystemConfig, EffectOptions } from './types';
import { easeOutCubic, generateId } from './utils';

/** デフォルト設定 */
const DEFAULT_CONFIG: SystemConfig = {
  width: 800,
  height: 600,
  timeScale: 2.5,
  backgroundColor: null,
  showFps: false,
  showParticleCount: false,
};

/** パーティクルシステム */
export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: SystemConfig;
  private particles: Particle[] = [];
  private effects: Map<string, Effect> = new Map();
  private animationId: number | null = null;
  private lastTime: number = 0;
  private fps: number = 0;
  private frameCount: number = 0;
  private fpsUpdateTime: number = 0;
  private onClickHandler: ((e: MouseEvent) => void) | null = null;
  private currentEffectName: string | null = null;

  constructor(canvas: HTMLCanvasElement, config: Partial<SystemConfig> = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
    this.config = { ...DEFAULT_CONFIG, ...config };

    // キャンバスサイズ設定
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
  }

  /** エフェクトを登録 */
  registerEffect(effect: Effect): void {
    this.effects.set(effect.config.name, effect);
  }

  /** 複数エフェクトを登録 */
  registerEffects(effects: Effect[]): void {
    effects.forEach((effect) => this.registerEffect(effect));
  }

  /** 登録済みエフェクト一覧を取得 */
  getEffectNames(): string[] {
    return Array.from(this.effects.keys());
  }

  /** エフェクトを取得 */
  getEffect(name: string): Effect | undefined {
    return this.effects.get(name);
  }

  /** 現在のエフェクト名を設定 */
  setCurrentEffect(name: string): void {
    if (this.effects.has(name)) {
      this.currentEffectName = name;
    }
  }

  /** 現在のエフェクト名を取得 */
  getCurrentEffectName(): string | null {
    return this.currentEffectName;
  }

  /** エフェクトをトリガー */
  trigger(effectName: string, x: number, y: number, options?: EffectOptions): void {
    const effect = this.effects.get(effectName);
    if (!effect) {
      console.warn(`Effect "${effectName}" not found`);
      return;
    }

    const newParticles = effect.create(x, y, options);
    // 各パーティクルにIDとエフェクト名を付与
    newParticles.forEach((p) => {
      p.id = generateId();
      p._effectName = effectName;
    });
    this.particles.push(...newParticles);
  }

  /** 現在選択中のエフェクトをトリガー */
  triggerCurrent(x: number, y: number, options?: EffectOptions): void {
    if (this.currentEffectName) {
      this.trigger(this.currentEffectName, x, y, options);
    }
  }

  /** クリックでエフェクトをトリガー */
  enableClickTrigger(): void {
    if (this.onClickHandler) return;

    this.onClickHandler = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.triggerCurrent(x, y);
    };

    this.canvas.addEventListener('click', this.onClickHandler);
  }

  /** クリックトリガーを無効化 */
  disableClickTrigger(): void {
    if (this.onClickHandler) {
      this.canvas.removeEventListener('click', this.onClickHandler);
      this.onClickHandler = null;
    }
  }

  /** パーティクルをクリア */
  clear(): void {
    this.particles = [];
    this.clearCanvas();
  }

  /** キャンバスをクリア */
  private clearCanvas(): void {
    if (this.config.backgroundColor) {
      this.ctx.fillStyle = this.config.backgroundColor;
      this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    } else {
      this.ctx.clearRect(0, 0, this.config.width, this.config.height);
    }
  }

  /** パーティクルを更新 */
  private updateParticles(): void {
    const timeScale = this.config.timeScale ?? 2.5;

    this.particles = this.particles
      .map((particle) => {
        const effect = this.effects.get(particle._effectName as string);
        if (effect) {
          return effect.update(particle, 1 / timeScale);
        }
        // デフォルト更新ロジック
        return this.defaultUpdate(particle, timeScale);
      })
      .filter((p): p is Particle => p !== null);
  }

  /** デフォルトのパーティクル更新ロジック */
  private defaultUpdate(particle: Particle, timeScale: number): Particle | null {
    const progress = particle.progress + 1 / timeScale;
    const delayVal = (particle.delay ?? 0) / timeScale;
    const effectiveProgress = Math.max(0, progress - delayVal);
    const t = effectiveProgress / particle.maxProgress;
    const alive = progress < particle.maxProgress + delayVal;

    if (alive) {
      return {
        ...particle,
        progress,
        alpha: effectiveProgress > 0 ? Math.max(0, 1 - easeOutCubic(Math.min(1, t))) : 0,
      };
    }
    return null;
  }

  /** パーティクルを描画 */
  private drawParticles(): void {
    for (const particle of this.particles) {
      const effect = this.effects.get(particle._effectName as string);
      if (effect) {
        effect.draw(this.ctx, particle);
      }
    }
  }

  /** FPS・パーティクル数を描画 */
  private drawStats(): void {
    if (!this.config.showFps && !this.config.showParticleCount) return;

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, 10, 120, this.config.showFps && this.config.showParticleCount ? 50 : 30);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px monospace';

    let y = 26;
    if (this.config.showFps) {
      this.ctx.fillText(`FPS: ${this.fps}`, 20, y);
      y += 20;
    }
    if (this.config.showParticleCount) {
      this.ctx.fillText(`Particles: ${this.particles.length}`, 20, y);
    }
    this.ctx.restore();
  }

  /** アニメーションループ */
  private loop = (currentTime: number): void => {
    // FPS計算
    this.frameCount++;
    if (currentTime - this.fpsUpdateTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsUpdateTime = currentTime;
    }

    // 更新・描画
    this.clearCanvas();
    this.updateParticles();
    this.drawParticles();
    this.drawStats();

    this.lastTime = currentTime;
    this.animationId = requestAnimationFrame(this.loop);
  };

  /** アニメーション開始 */
  start(): void {
    if (this.animationId !== null) return;
    this.lastTime = performance.now();
    this.fpsUpdateTime = this.lastTime;
    this.animationId = requestAnimationFrame(this.loop);
  }

  /** アニメーション停止 */
  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /** 設定を更新 */
  updateConfig(config: Partial<SystemConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.width !== undefined) this.canvas.width = config.width;
    if (config.height !== undefined) this.canvas.height = config.height;
  }

  /** 現在のパーティクル数を取得 */
  getParticleCount(): number {
    return this.particles.length;
  }

  /** コンテキストを取得 */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /** キャンバスを取得 */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /** 設定を取得 */
  getConfig(): SystemConfig {
    return { ...this.config };
  }
}

// ============================================================
// Canvas描画ヘルパー
// ============================================================

/** 円を描画 */
export function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha = 1
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** リングを描画 */
export function drawRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  lineWidth = 1,
  alpha = 1
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** 線を描画 */
export function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  lineWidth = 1,
  alpha = 1
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/** 星形を描画 */
export function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  points: number,
  color: string,
  fill = true,
  innerRatio = 0.4,
  alpha = 1
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();

  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? radius : radius * innerRatio;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.closePath();

  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  ctx.restore();
}

/** 矩形を描画 */
export function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  rotation = 0,
  alpha = 1
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.restore();
}

/** テキストを描画 */
export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  fontSize = 16,
  fontFamily = 'sans-serif',
  alpha = 1
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

/** グラデーション円を描画 */
export function drawGradientCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colorInner: string,
  colorOuter: string,
  alpha = 1
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, colorInner);
  gradient.addColorStop(1, colorOuter);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** 六角形を描画 */
export function drawHexagon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  fill = false,
  lineWidth = 1,
  alpha = 1
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const px = cx + radius * Math.cos(angle);
    const py = cy + radius * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.closePath();

  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  ctx.restore();
}

/** 楕円を描画 */
export function drawEllipse(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radiusX: number,
  radiusY: number,
  color: string,
  fill = false,
  lineWidth = 1,
  alpha = 1
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);

  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  ctx.restore();
}
