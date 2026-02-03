/**
 * Dimension エフェクト
 * ディメンション + 次元 + 空間
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4400ff', '#8800ff', '#cc00ff'];
interface DimensionParticle extends Particle { type: 'portal'; size: number; rotation: number; pulse: number; color: string; }
export const dimensionEffect: Effect = {
  config: { name: 'dimension', description: 'ディメンション + 次元', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DimensionParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'portal', x, y, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 20 + i * 10, rotation: i * 0.3, pulse: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DimensionParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.rotation += 0.03;
    p.pulse += 0.1;
    p.alpha = Math.sin(t * Math.PI) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DimensionParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2 + Math.sin(p.pulse) * 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },
};
