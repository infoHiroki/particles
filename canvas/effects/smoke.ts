/**
 * Smoke エフェクト
 * 煙 + 拡散 + フェード
 * 用途: 消失、神秘
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
import { drawGradientCircle } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#9e9e9e', '#757575', '#616161'];

interface PuffParticle extends Particle {
  type: 'puff';
  size: number;
  vx: number;
  vy: number;
  expansionRate: number;
  currentX: number;
  currentY: number;
  baseAlpha: number;
}

type SmokeParticle = PuffParticle;

export const smokeEffect: Effect = {
  config: {
    name: 'smoke',
    description: '煙 + 拡散 + フェード',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SmokeParticle[] = [];

    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      const baseAlpha = random(0.2, 0.5);
      particles.push({
        id: generateId(),
        type: 'puff',
        x: x + random(-10, 10),
        y,
        progress: 0,
        maxProgress: 80 + random(0, 40),
        delay: random(0, 20),
        alpha: baseAlpha,
        size: random(20, 40),
        vx: random(-0.5, 0.5),
        vy: -random(0.5, 2),
        expansionRate: random(0.2, 0.5),
        currentX: x + random(-10, 10),
        currentY: y,
        baseAlpha,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SmokeParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    p.currentX += p.vx + random(-0.3, 0.3);
    p.currentY += p.vy;
    p.size += p.expansionRate;
    p.alpha = p.baseAlpha * (1 - t * 0.8);

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SmokeParticle;
    ctx.save();

    const gradient = ctx.createRadialGradient(
      p.currentX,
      p.currentY,
      0,
      p.currentX,
      p.currentY,
      p.size
    );
    gradient.addColorStop(0, `rgba(150, 150, 150, ${p.alpha})`);
    gradient.addColorStop(0.5, `rgba(150, 150, 150, ${p.alpha * 0.5})`);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },
};
