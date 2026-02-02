/**
 * Success エフェクト
 * チェックマーク + 緑の光波 + 紙吹雪
 * 用途: フォーム成功、タスク完了
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic, easeOutElastic, easeOutQuad } from '../utils';
import { drawCircle, drawRing } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#4CAF50', '#8BC34A', '#CDDC39', '#00E676', '#69F0AE'];

interface CheckParticle extends Particle {
  type: 'check';
  scale: number;
  color: string;
}

interface WaveParticle extends Particle {
  type: 'wave';
  radius: number;
  color: string;
}

interface ConfettiParticle extends Particle {
  type: 'confetti';
  angle: number;
  distance: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  currentX: number;
  currentY: number;
}

type SuccessParticle = CheckParticle | WaveParticle | ConfettiParticle;

export const successEffect: Effect = {
  config: {
    name: 'success',
    description: 'チェックマーク + 緑の光波 + 紙吹雪',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: SuccessParticle[] = [];

    // チェックマーク
    particles.push({
      id: generateId(),
      type: 'check',
      x,
      y,
      progress: 0,
      maxProgress: 40,
      alpha: 1,
      scale: 0,
      color: colors[0],
    });

    // 光波
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(),
        type: 'wave',
        x,
        y,
        progress: 0,
        maxProgress: 50,
        delay: i * 8,
        alpha: 1,
        radius: 10,
        color: colors[i % colors.length],
      });
    }

    // 紙吹雪
    const confettiCount = Math.floor(20 * intensity);
    for (let i = 0; i < confettiCount; i++) {
      const angle = (i / confettiCount) * Math.PI * 2;
      particles.push({
        id: generateId(),
        type: 'confetti',
        x,
        y,
        progress: 0,
        maxProgress: 60 + random(0, 20),
        delay: random(0, 10),
        alpha: 1,
        angle,
        distance: 60 + random(0, 80),
        size: 4 + random(0, 4),
        color: randomPick(colors),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.2, 0.2),
        currentX: x,
        currentY: y,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SuccessParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'check':
        p.scale = easeOutElastic(Math.min(1, t * 1.5));
        p.alpha = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
        break;

      case 'wave':
        p.radius = 10 + easeOutQuad(t) * 80;
        p.alpha = 1 - easeOutCubic(t);
        break;

      case 'confetti':
        const eased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * eased + t * t * 100;
        p.rotation += p.rotationSpeed;
        p.alpha = t > 0.6 ? 1 - (t - 0.6) / 0.4 : 1;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SuccessParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'check':
        ctx.translate(p.x, p.y);
        ctx.scale(p.scale, p.scale);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(-5, 10);
        ctx.lineTo(15, -10);
        ctx.stroke();
        break;

      case 'wave':
        drawRing(ctx, p.x, p.y, p.radius, p.color, 2, p.alpha);
        break;

      case 'confetti':
        ctx.translate(p.currentX, p.currentY);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        break;
    }

    ctx.restore();
  },
};
