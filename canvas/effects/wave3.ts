/**
 * Wave3 エフェクト
 * 波動 + 波紋 + 振動波
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ccff', '#44ddff', '#88eeff'];
interface Wave3Particle extends Particle { type: 'wave'; size: number; expandSpeed: number; color: string; }
export const wave3Effect: Effect = {
  config: { name: 'wave3', description: '波動 + 波紋', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Wave3Particle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 50, delay: i * 8, alpha: 0, size: 5, expandSpeed: random(2, 4), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Wave3Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.size += p.expandSpeed;
    p.alpha = (1 - t) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Wave3Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },
};
