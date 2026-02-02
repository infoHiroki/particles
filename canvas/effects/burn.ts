/**
 * Burn エフェクト
 * 燃焼 + 炎上 + 煙
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff4400', '#ff6600', '#ff8800'];

interface BurnParticle extends Particle {
  type: 'flame' | 'ember' | 'smoke';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  color: string;
}

export const burnEffect: Effect = {
  config: { name: 'burn', description: '燃焼 + 炎上', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BurnParticle[] = [];

    // Flames
    const flameCount = Math.floor(15 * intensity);
    for (let i = 0; i < flameCount; i++) {
      particles.push({
        id: generateId(), type: 'flame', x, y, progress: 0,
        maxProgress: 30 + random(0, 20), delay: random(0, 20), alpha: 0,
        size: random(8, 20), currentX: x + random(-20, 20), currentY: y,
        vx: random(-0.5, 0.5), vy: -random(2, 4),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Embers
    const emberCount = Math.floor(12 * intensity);
    for (let i = 0; i < emberCount; i++) {
      particles.push({
        id: generateId(), type: 'ember', x, y, progress: 0,
        maxProgress: 40 + random(0, 20), delay: random(0, 25), alpha: 0,
        size: random(2, 4), currentX: x + random(-15, 15), currentY: y,
        vx: random(-1, 1), vy: -random(3, 6),
        color: '#ffcc00',
      });
    }

    // Smoke
    const smokeCount = Math.floor(8 * intensity);
    for (let i = 0; i < smokeCount; i++) {
      particles.push({
        id: generateId(), type: 'smoke', x, y, progress: 0,
        maxProgress: 50 + random(0, 20), delay: random(10, 30), alpha: 0,
        size: random(15, 30), currentX: x + random(-10, 10), currentY: y - 20,
        vx: random(-0.3, 0.3), vy: -random(1, 2),
        color: '#333333',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BurnParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    p.currentX += p.vx;
    p.currentY += p.vy;

    if (p.type === 'flame') {
      p.vx += random(-0.1, 0.1);
      p.size *= 0.97;
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    } else if (p.type === 'ember') {
      p.vx += random(-0.05, 0.05);
      p.alpha = 1 - t;
    } else {
      p.size += 0.5;
      p.alpha = t < 0.2 ? (t / 0.2) * 0.4 : (1 - t) / 0.8 * 0.4;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BurnParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'flame') {
      const g = ctx.createRadialGradient(
        p.currentX, p.currentY + p.size * 0.3, 0,
        p.currentX, p.currentY, p.size
      );
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.2, '#ffff00');
      g.addColorStop(0.5, p.color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(p.currentX, p.currentY, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'ember') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color + '60';
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
