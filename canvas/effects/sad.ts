/**
 * Sad エフェクト
 * 悲しみ + 涙 + 雨
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#6688bb', '#5577aa', '#446699'];

interface SadParticle extends Particle {
  type: 'tear' | 'drop' | 'cloud';
  size: number;
  currentX: number;
  currentY: number;
  vy: number;
  color: string;
}

export const sadEffect: Effect = {
  config: { name: 'sad', description: '悲しみ + 涙', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SadParticle[] = [];

    // Cloud
    particles.push({
      id: generateId(), type: 'cloud', x, y: y - 40, progress: 0, maxProgress: 70,
      alpha: 0, size: 40, currentX: x, currentY: y - 40, vy: 0, color: '#888899',
    });

    // Tears
    const tearCount = Math.floor(6 * intensity);
    for (let i = 0; i < tearCount; i++) {
      particles.push({
        id: generateId(), type: 'tear', x, y, progress: 0, maxProgress: 50,
        delay: random(10, 40), alpha: 0, size: random(5, 8),
        currentX: x + random(-30, 30), currentY: y - 20, vy: random(2, 4),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Rain drops
    const dropCount = Math.floor(15 * intensity);
    for (let i = 0; i < dropCount; i++) {
      particles.push({
        id: generateId(), type: 'drop', x, y, progress: 0, maxProgress: 45,
        delay: random(5, 35), alpha: 0, size: random(2, 4),
        currentX: x + random(-50, 50), currentY: y - 50 + random(-20, 0),
        vy: random(3, 6), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SadParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'cloud') {
      p.alpha = (t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1) * 0.5;
    } else if (p.type === 'tear') {
      p.currentY += p.vy;
      p.alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
    } else {
      p.currentY += p.vy;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SadParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'cloud') {
      ctx.fillStyle = p.color;
      // Draw cloud shape
      ctx.beginPath();
      ctx.arc(p.currentX - 20, p.currentY, 20, 0, Math.PI * 2);
      ctx.arc(p.currentX, p.currentY - 10, 25, 0, Math.PI * 2);
      ctx.arc(p.currentX + 20, p.currentY, 20, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'tear') {
      ctx.fillStyle = p.color;
      // Teardrop shape
      ctx.beginPath();
      ctx.moveTo(p.currentX, p.currentY - p.size);
      ctx.quadraticCurveTo(p.currentX + p.size, p.currentY, p.currentX, p.currentY + p.size * 1.5);
      ctx.quadraticCurveTo(p.currentX - p.size, p.currentY, p.currentX, p.currentY - p.size);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.currentX, p.currentY, p.size * 0.3, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
