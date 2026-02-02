/**
 * Combo エフェクト
 * 連鎖 + 数字増加
 * 用途: コンボ表示、連続ヒット
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutElastic, easeOutCubic, easeOutQuad } from '../utils';
import { drawCircle } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#ff5722', '#ff9800', '#ffc107', '#ffeb3b'];

interface NumberParticle extends Particle {
  type: 'number';
  scale: number;
  number: number;
  color: string;
}

interface ChainParticle extends Particle {
  type: 'chain';
  angle: number;
  distance: number;
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

interface SparkParticle extends Particle {
  type: 'spark';
  angle: number;
  distance: number;
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

type ComboParticle = NumberParticle | ChainParticle | SparkParticle;

export const comboEffect: Effect = {
  config: {
    name: 'combo',
    description: '連鎖 + 数字増加',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const colors = options.colors ?? DEFAULT_COLORS;
    const comboNum = (options.comboNum as number) ?? Math.floor(random(2, 10));
    const particles: ComboParticle[] = [];

    // 数字
    particles.push({
      id: generateId(),
      type: 'number',
      x,
      y,
      progress: 0,
      maxProgress: 60,
      alpha: 1,
      scale: 0,
      number: comboNum,
      color: colors[0],
    });

    // 連鎖エフェクト
    for (let i = 0; i < Math.min(comboNum, 12); i++) {
      const angle = (i / Math.min(comboNum, 12)) * Math.PI * 2;
      particles.push({
        id: generateId(),
        type: 'chain',
        x,
        y,
        progress: 0,
        maxProgress: 40,
        delay: i * 3,
        alpha: 1,
        angle,
        distance: 40 + i * 5,
        size: Math.max(4, 8 - i * 0.5),
        color: colors[i % colors.length],
        currentX: x,
        currentY: y,
      });
    }

    // 火花
    for (let i = 0; i < 15; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(),
        type: 'spark',
        x,
        y,
        progress: 0,
        maxProgress: 30,
        delay: random(0, 10),
        alpha: 1,
        angle,
        distance: random(30, 60),
        size: random(2, 4),
        color: randomPick(colors),
        currentX: x,
        currentY: y,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ComboParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'number':
        p.scale = easeOutElastic(Math.min(1, t * 1.5));
        p.alpha = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
        break;

      case 'chain':
        const eased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * eased;
        p.alpha = 1 - t;
        break;

      case 'spark':
        const easedSpark = easeOutQuad(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * easedSpark;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * easedSpark;
        p.alpha = 1 - t;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ComboParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'number':
        ctx.translate(p.x, p.y);
        ctx.scale(p.scale, p.scale);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(`${p.number}x`, 0, 0);
        ctx.fillText(`${p.number}x`, 0, 0);
        break;

      case 'chain':
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        drawCircle(ctx, p.currentX, p.currentY, p.size, p.color, p.alpha);
        break;

      case 'spark':
        drawCircle(ctx, p.currentX, p.currentY, p.size, p.color, p.alpha);
        break;
    }

    ctx.restore();
  },
};
