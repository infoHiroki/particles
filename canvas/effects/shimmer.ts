/**
 * Shimmer エフェクト
 * シマー + きらめき + 揺らめき
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ffffcc', '#ffccff'];
interface ShimmerParticle extends Particle { type: 'sparkle'; size: number; phase: number; freq: number; color: string; }
export const shimmerEffect: Effect = {
  config: { name: 'shimmer', description: 'シマー + きらめき', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ShimmerParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-50, 50), y: y + random(-50, 50), progress: 0, maxProgress: 60, delay: random(0, 20), alpha: 0, size: random(2, 4), phase: random(0, Math.PI * 2), freq: random(0.2, 0.4), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ShimmerParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += p.freq;
    p.alpha = Math.sin(t * Math.PI) * (0.3 + Math.abs(Math.sin(p.phase)) * 0.7);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ShimmerParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
