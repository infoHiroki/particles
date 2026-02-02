/**
 * Drip エフェクト
 * 滴り + 落下 + 水滴
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#88ccff'];
interface DripParticle extends Particle { type: 'drop' | 'splash'; size: number; vy: number; gravity: number; color: string; }
export const dripEffect: Effect = {
  config: { name: 'drip', description: '滴り + 落下', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DripParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'drop', x: x + random(-10, 10), y, progress: 0, maxProgress: 60, delay: i * 8, alpha: 0, size: random(4, 8), vy: 0, gravity: 0.15, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DripParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.vy += p.gravity;
    p.y += p.vy;
    p.alpha = 0.8;
    p.size = Math.max(2, p.size - 0.05);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DripParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
