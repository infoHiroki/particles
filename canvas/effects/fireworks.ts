/**
 * Fireworks エフェクト
 * 花火 + 打ち上げ + 爆発
 * 用途: お祝い、祭り、新年
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic, easeOutQuad } from '../utils';

const DEFAULT_COLORS = [
  '#ff0000', '#ff7700', '#ffff00', '#00ff00',
  '#00ffff', '#0077ff', '#ff00ff', '#ffffff'
];

interface RocketParticle extends Particle {
  type: 'rocket';
  vy: number;
  targetY: number;
  trailX: number[];
  trailY: number[];
  color: string;
  currentX: number;
  currentY: number;
}

interface BurstParticle extends Particle {
  type: 'burst';
  angle: number;
  distance: number;
  size: number;
  color: string;
  gravity: number;
  currentX: number;
  currentY: number;
  originX: number;
  originY: number;
}

interface SparkleParticle extends Particle {
  type: 'sparkle';
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

type FireworksParticle = RocketParticle | BurstParticle | SparkleParticle;

export const fireworksEffect: Effect = {
  config: {
    name: 'fireworks',
    description: '花火 + 打ち上げ + 爆発',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: FireworksParticle[] = [];

    // 爆発の中心色を決定
    const burstColor = randomPick(colors);

    // 爆発パーティクル
    const burstCount = Math.floor(50 * intensity);
    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * Math.PI * 2 + random(-0.1, 0.1);
      const distance = random(40, 120);
      particles.push({
        id: generateId(),
        type: 'burst',
        x,
        y,
        progress: 0,
        maxProgress: 60 + random(0, 30),
        alpha: 1,
        angle,
        distance,
        size: random(2, 4),
        color: burstColor,
        gravity: 0.08,
        currentX: x,
        currentY: y,
        originX: x,
        originY: y,
      });
    }

    // 内側の別色
    const innerColor = randomPick(colors.filter(c => c !== burstColor));
    const innerCount = Math.floor(20 * intensity);
    for (let i = 0; i < innerCount; i++) {
      const angle = (i / innerCount) * Math.PI * 2 + random(-0.2, 0.2);
      const distance = random(20, 50);
      particles.push({
        id: generateId(),
        type: 'burst',
        x,
        y,
        progress: 0,
        maxProgress: 50 + random(0, 20),
        alpha: 1,
        angle,
        distance,
        size: random(2, 3),
        color: innerColor,
        gravity: 0.05,
        currentX: x,
        currentY: y,
        originX: x,
        originY: y,
      });
    }

    // キラキラ
    const sparkleCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        id: generateId(),
        type: 'sparkle',
        x: x + random(-60, 60),
        y: y + random(-60, 60),
        progress: 0,
        maxProgress: 40 + random(0, 20),
        delay: random(10, 30),
        alpha: 0,
        size: random(1, 3),
        color: '#ffffff',
        currentX: x + random(-60, 60),
        currentY: y + random(-60, 60),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FireworksParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'burst':
        const eased = easeOutQuad(t);
        const baseX = p.originX + Math.cos(p.angle) * p.distance * eased;
        const baseY = p.originY + Math.sin(p.angle) * p.distance * eased;
        p.currentX = baseX;
        p.currentY = baseY + (t * t * p.gravity * 500);
        p.alpha = 1 - easeOutCubic(t);
        p.size *= 0.995;
        break;

      case 'sparkle':
        p.alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FireworksParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'burst':
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'sparkle':
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
