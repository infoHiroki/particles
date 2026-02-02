/**
 * Chain エフェクト
 * 鎖 + チェーン + 連結
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#888888', '#666666', '#444444'];
interface ChainParticle extends Particle { type: 'link'; size: number; linkIndex: number; swing: number; color: string; }
export const chainEffect: Effect = {
  config: { name: 'chain', description: '鎖 + チェーン', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ChainParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'link', x, y: y + i * 10, progress: 0, maxProgress: 60, delay: i * 2, alpha: 0, size: 8, linkIndex: i, swing: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ChainParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.swing += 0.1;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ChainParticle;
    const offsetX = Math.sin(p.swing + p.linkIndex * 0.3) * 5;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(p.x + offsetX, p.y, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },
};
