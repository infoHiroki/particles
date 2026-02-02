/**
 * Fire エフェクト
 * 炎 + 火の粉 + 揺らめき
 * 用途: 熱い、激しい
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic } from '../utils';
import { drawCircle, drawGradientCircle } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#ff4500', '#ff6a00', '#ff8c00', '#ffb700', '#ffe100'];

interface FlameParticle extends Particle {
  type: 'flame';
  size: number;
  vx: number;
  vy: number;
  color: string;
  currentX: number;
  currentY: number;
}

interface SparkParticle extends Particle {
  type: 'spark';
  size: number;
  vx: number;
  vy: number;
  color: string;
  currentX: number;
  currentY: number;
}

interface GlowParticle extends Particle {
  type: 'glow';
  radius: number;
  color: string;
}

type FireParticle = FlameParticle | SparkParticle | GlowParticle;

export const fireEffect: Effect = {
  config: {
    name: 'fire',
    description: '炎 + 火の粉 + 揺らめき',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: FireParticle[] = [];

    // 炎
    const flameCount = Math.floor(30 * intensity);
    for (let i = 0; i < flameCount; i++) {
      particles.push({
        id: generateId(),
        type: 'flame',
        x: x + random(-20, 20),
        y,
        progress: 0,
        maxProgress: 40 + random(0, 30),
        delay: random(0, 15),
        alpha: 1,
        size: 8 + random(0, 12),
        vx: random(-1, 1),
        vy: -random(2, 5),
        color: randomPick(colors),
        currentX: x + random(-20, 20),
        currentY: y,
      });
    }

    // 火の粉
    const sparkCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({
        id: generateId(),
        type: 'spark',
        x,
        y,
        progress: 0,
        maxProgress: 60 + random(0, 40),
        delay: random(0, 20),
        alpha: 1,
        size: 2 + random(0, 2),
        vx: random(-2, 2),
        vy: -random(3, 7),
        color: '#ffff00',
        currentX: x,
        currentY: y,
      });
    }

    // グロー
    particles.push({
      id: generateId(),
      type: 'glow',
      x,
      y,
      progress: 0,
      maxProgress: 50,
      alpha: 0.6,
      radius: 30,
      color: '#ff6a00',
    });

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FireParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'flame':
        p.currentX += p.vx + random(-0.5, 0.5);
        p.currentY += p.vy;
        p.size *= 0.98;
        p.alpha = 1 - easeOutCubic(t);
        break;

      case 'spark':
        p.currentX += p.vx + random(-0.3, 0.3);
        p.currentY += p.vy;
        p.vy += 0.05; // 少し重力
        p.alpha = 1 - t;
        break;

      case 'glow':
        p.radius = 30 + Math.sin(effectiveProgress * 0.3) * 10;
        p.alpha = 0.4 + Math.sin(effectiveProgress * 0.2) * 0.2;
        if (t > 0.7) {
          p.alpha *= 1 - (t - 0.7) / 0.3;
        }
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FireParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'flame':
        drawGradientCircle(ctx, p.currentX, p.currentY, p.size, p.color, 'transparent', p.alpha);
        break;

      case 'spark':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'glow':
        drawGradientCircle(ctx, p.x, p.y, p.radius, p.color, 'transparent', p.alpha);
        break;
    }

    ctx.restore();
  },
};
