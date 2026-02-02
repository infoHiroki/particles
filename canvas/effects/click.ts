/**
 * Click/Tap エフェクト
 * 波紋 + スプラッシュ
 * 用途: タップフィードバック
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, easeOutCubic, easeOutQuad } from '../utils';
import { drawRing, drawCircle } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#667eea', '#764ba2'];

interface RippleParticle extends Particle {
  type: 'ripple';
  radius: number;
  color: string;
}

interface SplashParticle extends Particle {
  type: 'splash';
  angle: number;
  distance: number;
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

type ClickParticle = RippleParticle | SplashParticle;

export const clickEffect: Effect = {
  config: {
    name: 'click',
    description: '波紋 + スプラッシュ',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const colors = options.colors ?? DEFAULT_COLORS;
    const color = typeof options.color === 'string' ? options.color : colors[0];
    const particles: ClickParticle[] = [];

    // 波紋
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(),
        type: 'ripple',
        x,
        y,
        progress: 0,
        maxProgress: 30,
        delay: i * 5,
        alpha: 1,
        radius: 5,
        color,
      });
    }

    // スプラッシュ
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      particles.push({
        id: generateId(),
        type: 'splash',
        x,
        y,
        progress: 0,
        maxProgress: 20,
        alpha: 1,
        angle,
        distance: 30,
        size: 3,
        color,
        currentX: x,
        currentY: y,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ClickParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'ripple':
        p.radius = 5 + easeOutCubic(t) * 40;
        p.alpha = 1 - easeOutCubic(t);
        break;

      case 'splash':
        const eased = easeOutQuad(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * eased;
        p.size = 3 * (1 - t);
        p.alpha = 1 - t;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ClickParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'ripple':
        drawRing(ctx, p.x, p.y, p.radius, p.color, 2, p.alpha);
        break;

      case 'splash':
        drawCircle(ctx, p.currentX, p.currentY, p.size, p.color, p.alpha);
        break;
    }

    ctx.restore();
  },
};
