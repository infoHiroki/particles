/**
 * Meteor エフェクト
 * 隕石 + 尾 + 衝撃
 * 用途: 宇宙、インパクト、ドラマチック
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ff4500', '#ff6600', '#ff8800', '#ffaa00'];

interface MeteorParticle extends Particle {
  type: 'meteor';
  size: number;
  angle: number;
  speed: number;
  tailLength: number;
  color: string;
  currentX: number;
  currentY: number;
}

interface TrailParticle extends Particle {
  type: 'trail';
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

interface ImpactParticle extends Particle {
  type: 'impact';
  radius: number;
}

interface DebrisParticle extends Particle {
  type: 'debris';
  angle: number;
  distance: number;
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

type MeteorEffectParticle = MeteorParticle | TrailParticle | ImpactParticle | DebrisParticle;

export const meteorEffect: Effect = {
  config: {
    name: 'meteor',
    description: '隕石 + 尾 + 衝撃',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MeteorEffectParticle[] = [];

    // 隕石本体
    particles.push({
      id: generateId(),
      type: 'meteor',
      x: x - 100,
      y: y - 100,
      progress: 0,
      maxProgress: 30,
      alpha: 1,
      size: 15,
      angle: Math.PI / 4,
      speed: 12,
      tailLength: 80,
      color: '#ff6600',
      currentX: x - 100,
      currentY: y - 100,
    });

    // 衝撃波（遅延）
    particles.push({
      id: generateId(),
      type: 'impact',
      x,
      y,
      progress: 0,
      maxProgress: 40,
      delay: 30,
      alpha: 1,
      radius: 10,
    });

    // 破片（遅延）
    const debrisCount = Math.floor(25 * intensity);
    for (let i = 0; i < debrisCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(),
        type: 'debris',
        x,
        y,
        progress: 0,
        maxProgress: 50 + random(0, 30),
        delay: 30,
        alpha: 1,
        angle,
        distance: random(30, 100),
        size: random(2, 6),
        color: random(0, 1) > 0.5 ? '#ff6600' : '#ffaa00',
        currentX: x,
        currentY: y,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MeteorEffectParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'meteor':
        p.currentX += Math.cos(p.angle) * p.speed;
        p.currentY += Math.sin(p.angle) * p.speed;
        p.alpha = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
        break;

      case 'impact':
        p.radius = 10 + easeOutCubic(t) * 80;
        p.alpha = 1 - easeOutCubic(t);
        break;

      case 'debris':
        const eased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * eased + t * t * 80;
        p.alpha = 1 - easeOutCubic(t);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MeteorEffectParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'meteor':
        // 尾
        const tailX = p.currentX - Math.cos(p.angle) * p.tailLength;
        const tailY = p.currentY - Math.sin(p.angle) * p.tailLength;

        const gradient = ctx.createLinearGradient(tailX, tailY, p.currentX, p.currentY);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, '#ffaa00');
        gradient.addColorStop(1, '#ffffff');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.size * 0.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(p.currentX, p.currentY);
        ctx.stroke();

        // 隕石本体
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'impact':
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'debris':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
