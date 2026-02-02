/**
 * Dew エフェクト
 * 露 + 滴 + 輝き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#aaddff', '#88ccff', '#66bbff'];

interface DewParticle extends Particle {
  type: 'drop' | 'sparkle';
  size: number;
  currentX: number;
  currentY: number;
  vy: number;
  color: string;
}

export const dewEffect: Effect = {
  config: { name: 'dew', description: '露 + 輝き', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DewParticle[] = [];

    // Dew drops
    const dropCount = Math.floor(12 * intensity);
    for (let i = 0; i < dropCount; i++) {
      particles.push({
        id: generateId(), type: 'drop', x, y, progress: 0,
        maxProgress: 50 + random(0, 20), delay: random(0, 25), alpha: 0,
        size: random(4, 10), currentX: x + random(-50, 50), currentY: y + random(-30, 30),
        vy: random(0.3, 0.8), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Sparkles
    const sparkleCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        id: generateId(), type: 'sparkle', x, y, progress: 0,
        maxProgress: 30 + random(0, 15), delay: random(0, 30), alpha: 0,
        size: random(2, 4), currentX: x + random(-60, 60), currentY: y + random(-40, 40),
        vy: 0, color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DewParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'drop') {
      p.currentY += p.vy;
      p.size *= 0.995;
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8 * 0.7;
    } else {
      p.alpha = Math.abs(Math.sin(p.progress * 0.3)) * (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DewParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'drop') {
      // Water drop with highlight
      const g = ctx.createRadialGradient(
        p.currentX - p.size * 0.3, p.currentY - p.size * 0.3, 0,
        p.currentX, p.currentY, p.size
      );
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.3, p.color);
      g.addColorStop(1, p.color + '80');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
