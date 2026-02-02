/**
 * Jump エフェクト
 * ジャンプ + 風 + 着地
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#88ccff', '#66aaff', '#4488ff'];

interface JumpParticle extends Particle {
  type: 'wind' | 'trail' | 'dust';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  color: string;
}

export const jumpEffect: Effect = {
  config: { name: 'jump', description: 'ジャンプ + 風', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: JumpParticle[] = [];

    // Upward wind lines
    const windCount = Math.floor(10 * intensity);
    for (let i = 0; i < windCount; i++) {
      particles.push({
        id: generateId(), type: 'wind', x, y, progress: 0, maxProgress: 20,
        delay: random(0, 5), alpha: 0, size: random(20, 40),
        currentX: x + random(-25, 25), currentY: y + random(0, 20),
        vx: random(-1, 1), vy: -random(8, 15),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Trail particles
    const trailCount = Math.floor(15 * intensity);
    for (let i = 0; i < trailCount; i++) {
      particles.push({
        id: generateId(), type: 'trail', x, y, progress: 0, maxProgress: 25,
        delay: random(0, 8), alpha: 0, size: random(3, 6),
        currentX: x + random(-20, 20), currentY: y + random(-10, 10),
        vx: random(-2, 2), vy: -random(5, 10),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Ground dust
    const dustCount = Math.floor(8 * intensity);
    for (let i = 0; i < dustCount; i++) {
      const angle = random(Math.PI * 0.6, Math.PI * 1.4);
      particles.push({
        id: generateId(), type: 'dust', x, y: y + 20, progress: 0, maxProgress: 30,
        delay: 0, alpha: 0, size: random(10, 20),
        currentX: x + random(-15, 15), currentY: y + 20,
        vx: Math.cos(angle) * random(2, 5), vy: Math.sin(angle) * random(1, 3),
        color: '#bbaa99',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as JumpParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    p.currentX += p.vx;
    p.currentY += p.vy;

    if (p.type === 'wind') {
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8 * 0.7;
    } else if (p.type === 'trail') {
      p.vy *= 0.95;
      p.alpha = 1 - t;
    } else {
      p.size += 0.2;
      p.alpha = (1 - t) * 0.4;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as JumpParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'wind') {
      const g = ctx.createLinearGradient(p.currentX, p.currentY + p.size, p.currentX, p.currentY);
      g.addColorStop(0, 'transparent');
      g.addColorStop(1, p.color);
      ctx.strokeStyle = g;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.currentX, p.currentY + p.size);
      ctx.lineTo(p.currentX, p.currentY);
      ctx.stroke();
    } else if (p.type === 'trail') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const g = ctx.createRadialGradient(p.currentX, p.currentY, 0, p.currentX, p.currentY, p.size);
      g.addColorStop(0, p.color + '60');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
