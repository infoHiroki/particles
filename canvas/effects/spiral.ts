/**
 * Spiral エフェクト
 * 螺旋 + 回転 + 収束/発散
 * 用途: 魔法、渦、エネルギー集中
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic, easeInQuad } from '../utils';

const DEFAULT_COLORS = ['#9c27b0', '#e91e63', '#673ab7', '#3f51b5'];

interface SpiralParticle extends Particle {
  type: 'spiral';
  angle: number;
  radius: number;
  radiusSpeed: number;
  rotationSpeed: number;
  size: number;
  color: string;
  currentX: number;
  currentY: number;
  expanding: boolean;
}

interface CoreParticle extends Particle {
  type: 'core';
  radius: number;
  color: string;
}

type SpiralEffectParticle = SpiralParticle | CoreParticle;

export const spiralEffect: Effect = {
  config: {
    name: 'spiral',
    description: '螺旋 + 回転 + 収束/発散',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const expanding = (options.expanding as boolean) ?? true;
    const particles: SpiralEffectParticle[] = [];

    // 中心コア
    particles.push({
      id: generateId(),
      type: 'core',
      x,
      y,
      progress: 0,
      maxProgress: 80,
      alpha: 0,
      radius: 5,
      color: colors[0],
    });

    // 螺旋パーティクル
    const count = Math.floor(40 * intensity);
    for (let i = 0; i < count; i++) {
      const startAngle = (i / count) * Math.PI * 2 * 3;
      const startRadius = expanding ? 5 : 100;
      particles.push({
        id: generateId(),
        type: 'spiral',
        x,
        y,
        progress: 0,
        maxProgress: 80 + random(0, 20),
        delay: (i / count) * 20,
        alpha: 1,
        angle: startAngle,
        radius: startRadius + random(-5, 5),
        radiusSpeed: expanding ? random(1.5, 2.5) : -random(1.5, 2.5),
        rotationSpeed: random(0.15, 0.25),
        size: random(2, 5),
        color: randomPick(colors),
        currentX: x,
        currentY: y,
        expanding,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SpiralEffectParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'spiral':
        p.angle += p.rotationSpeed;
        p.radius += p.radiusSpeed;
        p.currentX = p.x + Math.cos(p.angle) * p.radius;
        p.currentY = p.y + Math.sin(p.angle) * p.radius;
        p.alpha = p.expanding
          ? 1 - easeOutCubic(t)
          : t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
        p.size *= p.expanding ? 0.995 : 1.005;
        break;

      case 'core':
        p.alpha = t < 0.2 ? t / 0.2 * 0.8 : t > 0.8 ? (1 - (t - 0.8) / 0.2) * 0.8 : 0.8;
        p.radius = 5 + Math.sin(effectiveProgress * 0.2) * 3;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SpiralEffectParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'spiral':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'core':
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.5, `${p.color}80`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
