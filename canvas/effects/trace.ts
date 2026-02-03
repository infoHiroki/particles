/**
 * Trace エフェクト
 * 軌跡 + トレース + 痕跡
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa44', '#ffbb66', '#ffcc88'];
interface TraceParticle extends Particle { type: 'dot'; size: number; trailIndex: number; angle: number; dist: number; color: string; }
export const traceEffect: Effect = {
  config: { name: 'trace', description: '軌跡 + トレース', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TraceParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'dot', x, y, progress: 0, maxProgress: 50, delay: i * 2, alpha: 0, size: 4 - i * 0.15, trailIndex: i, angle: 0, dist: i * 3, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TraceParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += 0.15;
    p.alpha = (1 - t) * (1 - p.trailIndex * 0.04);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TraceParticle;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * p.dist;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
