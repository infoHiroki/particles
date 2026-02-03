/**
 * Spill エフェクト
 * スピル + こぼれ + 広がり
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#88ccff'];
interface SpillParticle extends Particle { type: 'puddle'; size: number; maxSize: number; color: string; }
export const spillEffect: Effect = {
  config: { name: 'spill', description: 'スピル + こぼれ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SpillParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'puddle', x: x + random(-20, 20), y: y + random(-10, 10), progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 5, maxSize: random(30, 50), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SpillParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.size = 5 + (p.maxSize - 5) * t;
    p.alpha = (1 - t) * 0.5;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SpillParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
