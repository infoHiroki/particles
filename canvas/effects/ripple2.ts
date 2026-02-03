/**
 * Ripple2 エフェクト
 * リップル2 + 波紋2 + 干渉
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#88ccff'];
interface Ripple2Particle extends Particle { type: 'ring'; size: number; maxSize: number; thickness: number; color: string; }
export const ripple2Effect: Effect = {
  config: { name: 'ripple2', description: 'リップル2 + 波紋2', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Ripple2Particle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 50, delay: i * 8, alpha: 0, size: 5, maxSize: 50 + i * 15, thickness: random(1, 3), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Ripple2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.size = 5 + (p.maxSize - 5) * t;
    p.alpha = (1 - t) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Ripple2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.thickness;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },
};
