/**
 * Grid エフェクト
 * グリッド + 格子 + マス目
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#3377ee', '#2266dd'];
interface GridParticle extends Particle { type: 'line'; size: number; isHorizontal: boolean; offset: number; color: string; }
export const gridEffect: Effect = {
  config: { name: 'grid', description: 'グリッド + 格子', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GridParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'line', x, y, progress: 0, maxProgress: 50, delay: i * 3, alpha: 0, size: 60, isHorizontal: i % 2 === 0, offset: (i - count / 2) * 15, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GridParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GridParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (p.isHorizontal) {
      ctx.moveTo(p.x - p.size, p.y + p.offset);
      ctx.lineTo(p.x + p.size, p.y + p.offset);
    } else {
      ctx.moveTo(p.x + p.offset, p.y - p.size);
      ctx.lineTo(p.x + p.offset, p.y + p.size);
    }
    ctx.stroke();
    ctx.restore();
  },
};
