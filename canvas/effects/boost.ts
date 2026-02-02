/**
 * Boost エフェクト
 * 加速 + 噴射 + 軌跡
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ff6600', '#ff8800', '#ffaa00', '#ffcc00'];

interface BoostParticle extends Particle {
  type: 'flame' | 'trail';
  size: number; angle: number; speed: number; currentX: number; currentY: number; color: string;
}

export const boostEffect: Effect = {
  config: { name: 'boost', description: '加速 + 噴射', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const angle = (options.angle as number) ?? Math.PI;
    const particles: BoostParticle[] = [];
    const count = Math.floor(40 * intensity);
    for (let i = 0; i < count; i++) {
      const a = angle + random(-0.4, 0.4);
      particles.push({
        id: generateId(), type: 'flame', x, y, progress: 0, maxProgress: 30 + random(0, 20),
        delay: random(0, 15), alpha: 0, size: random(4, 10), angle: a,
        speed: random(5, 12), currentX: x, currentY: y,
        color: DEFAULT_COLORS[Math.floor(random(0, 4))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BoostParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.currentX += Math.cos(p.angle) * p.speed;
    p.currentY += Math.sin(p.angle) * p.speed;
    p.speed *= 0.95;
    p.size *= 0.97;
    p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BoostParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    const g = ctx.createRadialGradient(p.currentX, p.currentY, 0, p.currentX, p.currentY, p.size);
    g.addColorStop(0, p.color); g.addColorStop(0.5, p.color + '80'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.beginPath();
    ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
};
