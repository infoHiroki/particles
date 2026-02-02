/**
 * Loading エフェクト
 * 回転ドット/リング + パルス
 * 用途: 読み込み中
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, easeOutCubic } from '../utils';
import { drawCircle, drawRing } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#667eea', '#764ba2'];

interface DotParticle extends Particle {
  type: 'dot';
  index: number;
  radius: number;
  dotSize: number;
  color: string;
  currentAngle: number;
}

interface PulseParticle extends Particle {
  type: 'pulse';
  ringRadius: number;
  color: string;
}

type LoadingParticle = DotParticle | PulseParticle;

export const loadingEffect: Effect = {
  config: {
    name: 'loading',
    description: '回転ドット/リング + パルス',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const colors = options.colors ?? DEFAULT_COLORS;
    const color = colors[0];
    const particles: LoadingParticle[] = [];

    // 回転ドット
    for (let i = 0; i < 8; i++) {
      particles.push({
        id: generateId(),
        type: 'dot',
        x,
        y,
        progress: 0,
        maxProgress: 120,
        alpha: 1,
        index: i,
        radius: 30,
        dotSize: 6,
        color,
        currentAngle: (i / 8) * Math.PI * 2,
      });
    }

    // パルス
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(),
        type: 'pulse',
        x,
        y,
        progress: 0,
        maxProgress: 60,
        delay: i * 20,
        alpha: 1,
        ringRadius: 20,
        color,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LoadingParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    // Loading は継続的なので、ループさせる
    if (t >= 1) {
      p.progress = delayFrames * deltaTime;
      return p;
    }

    switch (p.type) {
      case 'dot':
        const baseAngle = (p.index / 8) * Math.PI * 2;
        p.currentAngle = baseAngle + effectiveProgress * 0.1;
        p.alpha = 0.3 + Math.sin(effectiveProgress * 0.2 - p.index * 0.5) * 0.35 + 0.35;
        break;

      case 'pulse':
        p.ringRadius = 20 + easeOutCubic(t) * 30;
        p.alpha = 0.5 * (1 - t);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LoadingParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'dot':
        const dx = p.x + Math.cos(p.currentAngle) * p.radius;
        const dy = p.y + Math.sin(p.currentAngle) * p.radius;
        drawCircle(ctx, dx, dy, p.dotSize, p.color, p.alpha);
        break;

      case 'pulse':
        drawRing(ctx, p.x, p.y, p.ringRadius, p.color, 2, p.alpha);
        break;
    }

    ctx.restore();
  },
};
