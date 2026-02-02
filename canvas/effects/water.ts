/**
 * Water エフェクト
 * 水滴 + 波紋 + 泡
 * 用途: 涼しい、清涼感
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';
import { drawEllipse, drawRing } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#4fc3f7', '#29b6f6', '#03a9f4', '#0288d1'];

interface DropParticle extends Particle {
  type: 'drop';
  vx: number;
  vy: number;
  gravity: number;
  size: number;
  currentX: number;
  currentY: number;
}

interface RippleParticle extends Particle {
  type: 'ripple';
  radius: number;
  color: string;
}

interface BubbleParticle extends Particle {
  type: 'bubble';
  vy: number;
  size: number;
  currentX: number;
  currentY: number;
}

type WaterParticle = DropParticle | RippleParticle | BubbleParticle;

export const waterEffect: Effect = {
  config: {
    name: 'water',
    description: '水滴 + 波紋 + 泡',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: WaterParticle[] = [];

    // 水滴
    const dropCount = Math.floor(15 * intensity);
    for (let i = 0; i < dropCount; i++) {
      const angle = random(-Math.PI * 0.8, -Math.PI * 0.2);
      particles.push({
        id: generateId(),
        type: 'drop',
        x,
        y,
        progress: 0,
        maxProgress: 40 + random(0, 20),
        alpha: random(0.5, 1),
        vx: Math.cos(angle) * random(2, 6),
        vy: Math.sin(angle) * random(3, 8),
        gravity: 0.3,
        size: random(3, 8),
        currentX: x,
        currentY: y,
      });
    }

    // 波紋
    for (let i = 0; i < 4; i++) {
      particles.push({
        id: generateId(),
        type: 'ripple',
        x,
        y: y + 30,
        progress: 0,
        maxProgress: 50,
        delay: i * 10,
        alpha: 1,
        radius: 5,
        color: colors[i % colors.length],
      });
    }

    // 泡
    const bubbleCount = Math.floor(8 * intensity);
    for (let i = 0; i < bubbleCount; i++) {
      particles.push({
        id: generateId(),
        type: 'bubble',
        x: x + random(-30, 30),
        y: y + 30,
        progress: 0,
        maxProgress: 60 + random(0, 30),
        delay: random(0, 20),
        alpha: random(0.3, 0.6),
        vy: -random(0.5, 2),
        size: random(2, 6),
        currentX: x + random(-30, 30),
        currentY: y + 30,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WaterParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'drop':
        p.vy += p.gravity;
        p.currentX += p.vx;
        p.currentY += p.vy;
        p.alpha = 1 - t;
        break;

      case 'ripple':
        p.radius = 5 + easeOutCubic(t) * 60;
        p.alpha = 1 - easeOutCubic(t);
        break;

      case 'bubble':
        p.currentY += p.vy;
        p.currentX += Math.sin(effectiveProgress * 0.1) * 0.3;
        p.alpha = p.alpha * (1 - t * 0.3);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WaterParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'drop':
        ctx.fillStyle = '#4fc3f7';
        ctx.beginPath();
        ctx.ellipse(p.currentX, p.currentY, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'ripple':
        drawEllipse(ctx, p.x, p.y, p.radius, p.radius * 0.3, p.color, false, 2, p.alpha);
        break;

      case 'bubble':
        // 泡の外枠
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.stroke();

        // ハイライト
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(
          p.currentX - p.size * 0.3,
          p.currentY - p.size * 0.3,
          p.size * 0.2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
