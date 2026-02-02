/**
 * Pour エフェクト
 * 注ぐ + 流れ + 液体
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#8866ff', '#aa88ff', '#ccaaff'];
interface PourParticle extends Particle { type: 'stream'; size: number; vy: number; vx: number; color: string; }
export const pourEffect: Effect = {
  config: { name: 'pour', description: '注ぐ + 流れ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PourParticle[] = [];
    const count = Math.floor(30 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'stream', x: x + random(-5, 5), y, progress: 0, maxProgress: 60, delay: i * 2, alpha: 0, size: random(3, 6), vy: random(2, 4), vx: random(-0.3, 0.3), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PourParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.x += p.vx;
    p.alpha = 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PourParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
