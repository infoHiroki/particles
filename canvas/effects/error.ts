/**
 * Error エフェクト
 * X印 + 赤い振動波 + シェイク
 * 用途: バリデーションエラー
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic, easeOutElastic, easeOutQuad } from '../utils';
import { drawRing, drawCircle } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#f44336', '#ff5252', '#ff1744', '#d50000'];

interface CrossParticle extends Particle {
  type: 'cross';
  scale: number;
  shake: number;
  color: string;
}

interface ShakeWaveParticle extends Particle {
  type: 'shakeWave';
  radius: number;
  color: string;
}

interface FragmentParticle extends Particle {
  type: 'fragment';
  angle: number;
  distance: number;
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

type ErrorParticle = CrossParticle | ShakeWaveParticle | FragmentParticle;

export const errorEffect: Effect = {
  config: {
    name: 'error',
    description: 'X印 + 赤い振動波 + シェイク',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: ErrorParticle[] = [];

    // X印
    particles.push({
      id: generateId(),
      type: 'cross',
      x,
      y,
      progress: 0,
      maxProgress: 40,
      alpha: 1,
      scale: 0,
      shake: 0,
      color: colors[0],
    });

    // 振動波
    for (let i = 0; i < 4; i++) {
      particles.push({
        id: generateId(),
        type: 'shakeWave',
        x,
        y,
        progress: 0,
        maxProgress: 30,
        delay: i * 5,
        alpha: 1,
        radius: 5,
        color: colors[i % colors.length],
      });
    }

    // 破片
    const fragmentCount = Math.floor(12 * intensity);
    for (let i = 0; i < fragmentCount; i++) {
      const angle = (i / fragmentCount) * Math.PI * 2 + random(-0.2, 0.2);
      particles.push({
        id: generateId(),
        type: 'fragment',
        x,
        y,
        progress: 0,
        maxProgress: 40 + random(0, 20),
        alpha: 1,
        angle,
        distance: 30 + random(0, 50),
        size: 3 + random(0, 3),
        color: randomPick(colors),
        currentX: x,
        currentY: y,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ErrorParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'cross':
        p.scale = easeOutElastic(Math.min(1, t * 1.5));
        p.shake = t < 0.3 ? Math.sin(t * 50) * (1 - t / 0.3) * 5 : 0;
        p.alpha = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
        break;

      case 'shakeWave':
        p.radius = 5 + easeOutQuad(t) * 50;
        p.alpha = 1 - t;
        break;

      case 'fragment':
        const eased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * eased;
        p.alpha = 1 - easeOutCubic(t);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ErrorParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'cross':
        ctx.translate(p.x + p.shake, p.y);
        ctx.scale(p.scale, p.scale);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-12, -12);
        ctx.lineTo(12, 12);
        ctx.moveTo(12, -12);
        ctx.lineTo(-12, 12);
        ctx.stroke();
        break;

      case 'shakeWave':
        drawRing(ctx, p.x, p.y, p.radius, p.color, 2, p.alpha);
        break;

      case 'fragment':
        drawCircle(ctx, p.currentX, p.currentY, p.size, p.color, p.alpha);
        break;
    }

    ctx.restore();
  },
};
