/**
 * Paralyze エフェクト
 * 麻痺 + 痺れ + 硬直
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffff44', '#ffff88', '#ffffcc'];
interface ParalyzeParticle extends Particle { type: 'spark'; size: number; segments: {x: number, y: number}[]; color: string; }
export const paralyzeEffect: Effect = {
  config: { name: 'paralyze', description: '麻痺 + 痺れ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ParalyzeParticle[] = [];
    const count = Math.floor(6 * intensity);
    for (let i = 0; i < count; i++) {
      const segments: {x: number, y: number}[] = [];
      let cx = x + random(-30, 30);
      let cy = y + random(-30, 30);
      segments.push({x: cx, y: cy});
      for (let j = 0; j < 4; j++) {
        cx += random(-15, 15);
        cy += random(-15, 15);
        segments.push({x: cx, y: cy});
      }
      particles.push({ id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 30, delay: i * 5, alpha: 0, size: random(1, 2), segments, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ParalyzeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = t < 0.3 ? 1 : (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ParalyzeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.moveTo(p.segments[0].x, p.segments[0].y);
    for (let i = 1; i < p.segments.length; i++) {
      ctx.lineTo(p.segments[i].x, p.segments[i].y);
    }
    ctx.stroke();
    ctx.restore();
  },
};
