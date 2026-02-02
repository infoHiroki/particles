/**
 * Bleed エフェクト
 * 出血 + 滴り + 飛散
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#cc0000', '#aa0000', '#880000'];

interface BleedParticle extends Particle {
  type: 'drop' | 'splash' | 'drip';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  color: string;
}

export const bleedEffect: Effect = {
  config: { name: 'bleed', description: '出血 + 滴り', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BleedParticle[] = [];

    // Splashes
    const splashCount = Math.floor(12 * intensity);
    for (let i = 0; i < splashCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(3, 8);
      particles.push({
        id: generateId(), type: 'splash', x, y, progress: 0, maxProgress: 25,
        delay: 0, alpha: 0, size: random(3, 7),
        currentX: x, currentY: y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Drops
    const dropCount = Math.floor(8 * intensity);
    for (let i = 0; i < dropCount; i++) {
      particles.push({
        id: generateId(), type: 'drop', x, y, progress: 0, maxProgress: 40,
        delay: random(0, 10), alpha: 0, size: random(4, 8),
        currentX: x + random(-15, 15), currentY: y + random(-10, 10),
        vx: random(-0.5, 0.5), vy: random(1, 3),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Drips
    const dripCount = Math.floor(6 * intensity);
    for (let i = 0; i < dripCount; i++) {
      particles.push({
        id: generateId(), type: 'drip', x, y, progress: 0, maxProgress: 50,
        delay: random(5, 20), alpha: 0, size: random(2, 4),
        currentX: x + random(-20, 20), currentY: y,
        vx: 0, vy: random(2, 4),
        color: DEFAULT_COLORS[0],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BleedParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'splash') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.vy += 0.15;
      p.alpha = 1 - t;
    } else if (p.type === 'drop') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vy += 0.1;
      p.alpha = t < 0.1 ? t / 0.1 : 1 - (t - 0.1) / 0.9;
    } else {
      p.currentY += p.vy;
      p.size *= 0.99;
      p.alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BleedParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;

    if (p.type === 'splash' || p.type === 'drop') {
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Teardrop shape
      ctx.beginPath();
      ctx.moveTo(p.currentX, p.currentY - p.size);
      ctx.quadraticCurveTo(p.currentX + p.size, p.currentY, p.currentX, p.currentY + p.size * 1.5);
      ctx.quadraticCurveTo(p.currentX - p.size, p.currentY, p.currentX, p.currentY - p.size);
      ctx.fill();
    }
    ctx.restore();
  },
};
