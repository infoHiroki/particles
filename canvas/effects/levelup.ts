/**
 * LevelUp エフェクト
 * 上昇光柱 + 輝き
 * 用途: レベルアップ、ランクアップ
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic } from '../utils';
import { drawCircle } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#ffd700', '#ffeb3b', '#fff176', '#ffff8d'];

interface PillarParticle extends Particle {
  type: 'pillar';
  height: number;
  width: number;
}

interface SparkleParticle extends Particle {
  type: 'sparkle';
  targetX: number;
  targetY: number;
  size: number;
  color: string;
}

interface RisingParticle extends Particle {
  type: 'rising';
  vy: number;
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

type LevelUpParticle = PillarParticle | SparkleParticle | RisingParticle;

export const levelupEffect: Effect = {
  config: {
    name: 'levelup',
    description: '上昇光柱 + 輝き',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: LevelUpParticle[] = [];

    // 上昇光柱
    particles.push({
      id: generateId(),
      type: 'pillar',
      x,
      y,
      progress: 0,
      maxProgress: 60,
      alpha: 0,
      height: 0,
      width: 40,
    });

    // 輝き
    const sparkleCount = Math.floor(20 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      const angle = random(0, Math.PI * 2);
      const distance = random(20, 80);
      particles.push({
        id: generateId(),
        type: 'sparkle',
        x,
        y,
        progress: 0,
        maxProgress: 50 + random(0, 20),
        delay: random(0, 20),
        alpha: 0,
        targetX: x + Math.cos(angle) * distance,
        targetY: y + Math.sin(angle) * distance - 50,
        size: random(2, 5),
        color: randomPick(colors),
      });
    }

    // 上昇パーティクル
    const risingCount = Math.floor(30 * intensity);
    for (let i = 0; i < risingCount; i++) {
      particles.push({
        id: generateId(),
        type: 'rising',
        x: x + random(-30, 30),
        y: y + random(0, 20),
        progress: 0,
        maxProgress: 60 + random(0, 30),
        delay: random(0, 15),
        alpha: 1,
        vy: -random(2, 5),
        size: random(2, 4),
        color: randomPick(colors),
        currentX: x + random(-30, 30),
        currentY: y + random(0, 20),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LevelUpParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'pillar':
        p.height = easeOutCubic(Math.min(1, t * 2)) * 200;
        p.alpha = t < 0.3 ? (t / 0.3) * 0.6 : t > 0.7 ? ((1 - (t - 0.7) / 0.3) * 0.6) : 0.6;
        break;

      case 'sparkle':
        p.alpha = t < 0.3 ? t / 0.3 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
        break;

      case 'rising':
        p.currentY += p.vy;
        p.currentX += random(-0.5, 0.5);
        p.alpha = 1 - t;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LevelUpParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'pillar':
        const gradient = ctx.createLinearGradient(p.x, p.y, p.x, p.y - p.height);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 235, 59, 0.4)');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(p.x - p.width / 2, p.y);
        ctx.lineTo(p.x - p.width / 4, p.y - p.height);
        ctx.lineTo(p.x + p.width / 4, p.y - p.height);
        ctx.lineTo(p.x + p.width / 2, p.y);
        ctx.closePath();
        ctx.fill();
        break;

      case 'sparkle':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const r = i % 2 === 0 ? p.size : p.size * 0.3;
          const px = p.targetX + r * Math.cos(angle);
          const py = p.targetY + r * Math.sin(angle);
          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 'rising':
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        drawCircle(ctx, p.currentX, p.currentY, p.size, p.color, p.alpha);
        break;
    }

    ctx.restore();
  },
};
