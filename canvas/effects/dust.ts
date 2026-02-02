/**
 * Dust エフェクト
 * 塵 + 光の筋 + 漂い
 * 用途: 神秘的、静寂
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
import { drawCircle } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#ffffd4', '#fff8e1', '#ffecb3'];

interface MoteParticle extends Particle {
  type: 'mote';
  size: number;
  vx: number;
  vy: number;
  currentX: number;
  currentY: number;
  baseAlpha: number;
}

interface RayParticle extends Particle {
  type: 'ray';
  angle: number;
  width: number;
  length: number;
}

type DustParticle = MoteParticle | RayParticle;

export const dustEffect: Effect = {
  config: {
    name: 'dust',
    description: '塵 + 光の筋 + 漂い',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DustParticle[] = [];

    // 塵
    const moteCount = Math.floor(40 * intensity);
    for (let i = 0; i < moteCount; i++) {
      const baseAlpha = random(0.2, 0.6);
      particles.push({
        id: generateId(),
        type: 'mote',
        x: x + random(-100, 100),
        y: y + random(-100, 100),
        progress: 0,
        maxProgress: 150 + random(0, 100),
        alpha: baseAlpha,
        size: random(1, 3),
        vx: random(-0.2, 0.2),
        vy: random(-0.2, 0.2),
        currentX: x + random(-100, 100),
        currentY: y + random(-100, 100),
        baseAlpha,
      });
    }

    // 光の筋
    const rayCount = Math.floor(3 * intensity);
    for (let i = 0; i < rayCount; i++) {
      const angle = random(-0.3, 0.3) - Math.PI / 4;
      particles.push({
        id: generateId(),
        type: 'ray',
        x,
        y,
        progress: 0,
        maxProgress: 100,
        delay: random(0, 30),
        alpha: 0,
        angle,
        width: random(30, 60),
        length: random(150, 250),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DustParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'mote':
        p.currentX += p.vx + random(-0.1, 0.1);
        p.currentY += p.vy + random(-0.1, 0.1);
        p.alpha = p.baseAlpha * (t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1);
        break;

      case 'ray':
        p.alpha = t < 0.2 ? (t / 0.2) * 0.15 : t > 0.7 ? ((1 - (t - 0.7) / 0.3) * 0.15) : 0.15;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DustParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'mote':
        // 塵にグロー効果
        ctx.shadowColor = '#ffffd4';
        ctx.shadowBlur = 3;
        ctx.fillStyle = '#ffffd4';
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'ray':
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        const gradient = ctx.createLinearGradient(0, -p.width / 2, p.length, p.width / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.15)');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(p.length, -p.width / 2);
        ctx.lineTo(p.length, p.width / 2);
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
