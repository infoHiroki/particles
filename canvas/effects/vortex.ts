/**
 * Vortex エフェクト
 * 渦 + 吸い込み + 回転
 * 用途: ブラックホール、吸引、消失
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeInQuad } from '../utils';

const DEFAULT_COLORS = ['#4400ff', '#6622ff', '#8844ff', '#aa66ff'];

interface SwirlParticle extends Particle {
  type: 'swirl';
  angle: number;
  radius: number;
  radiusSpeed: number;
  rotationSpeed: number;
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

interface CoreParticle extends Particle {
  type: 'core';
  radius: number;
  pulsePhase: number;
}

type VortexParticle = SwirlParticle | CoreParticle;

export const vortexEffect: Effect = {
  config: {
    name: 'vortex',
    description: '渦 + 吸い込み + 回転',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: VortexParticle[] = [];

    particles.push({
      id: generateId(),
      type: 'core',
      x, y,
      progress: 0,
      maxProgress: 80,
      alpha: 0,
      radius: 10,
      pulsePhase: 0,
    });

    const count = Math.floor(60 * intensity);
    for (let i = 0; i < count; i++) {
      const startAngle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(),
        type: 'swirl',
        x, y,
        progress: 0,
        maxProgress: 60 + random(0, 30),
        delay: random(0, 20),
        alpha: 1,
        angle: startAngle,
        radius: random(80, 120),
        radiusSpeed: -random(1.5, 2.5),
        rotationSpeed: random(0.1, 0.2),
        size: random(2, 5),
        color: randomPick(colors),
        currentX: x + Math.cos(startAngle) * 100,
        currentY: y + Math.sin(startAngle) * 100,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as VortexParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) return p;

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    if (p.type === 'core') {
      p.pulsePhase += 0.15;
      p.radius = 10 + Math.sin(p.pulsePhase) * 3;
      p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    } else {
      p.angle += p.rotationSpeed * (1 + (1 - p.radius / 120) * 2);
      p.radius += p.radiusSpeed;
      if (p.radius < 5) p.radius = 5;
      p.currentX = p.x + Math.cos(p.angle) * p.radius;
      p.currentY = p.y + Math.sin(p.angle) * p.radius;
      p.alpha = p.radius > 20 ? 1 - easeInQuad(t) * 0.5 : (p.radius / 20) * 0.5;
      p.size *= 0.995;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as VortexParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'core') {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
      gradient.addColorStop(0, '#000022');
      gradient.addColorStop(0.5, '#220044');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },
};
