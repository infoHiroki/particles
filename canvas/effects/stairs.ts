/**
 * Stairs エフェクト
 * 階段 + 上昇 + ステップ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#999999', '#888888', '#aaaaaa'];
interface StairsParticle extends Particle { type: 'step'; size: number; level: number; color: string; }
export const stairsEffect: Effect = {
  config: { name: 'stairs', description: '階段 + 上昇', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: StairsParticle[] = [];
    const steps = Math.floor(6 * intensity);
    for (let i = 0; i < steps; i++) {
      particles.push({ id: generateId(), type: 'step', x: x - 30 + i * 12, y: y + 25 - i * 10, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 20, level: i, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StairsParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StairsParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - 3, p.size, 8);
    ctx.fillStyle = '#777777';
    ctx.fillRect(p.x - p.size / 2, p.y + 5, p.size, 5);
    ctx.restore();
  },
};
