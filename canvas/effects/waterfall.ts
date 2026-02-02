/**
 * Waterfall エフェクト
 * 滝 + 落下 + 飛沫
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#ffffff'];
interface WaterfallParticle extends Particle { type: 'fall' | 'mist'; size: number; vy: number; vx: number; color: string; }
export const waterfallEffect: Effect = {
  config: { name: 'waterfall', description: '滝 + 落下', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: WaterfallParticle[] = [];
    const fallCount = Math.floor(30 * intensity);
    for (let i = 0; i < fallCount; i++) {
      particles.push({ id: generateId(), type: 'fall', x: x + random(-15, 15), y: y - 30, progress: 0, maxProgress: 50, delay: i * 1.5, alpha: 0, size: random(3, 6), vy: random(3, 5), vx: random(-0.2, 0.2), color: DEFAULT_COLORS[i % 2] });
    }
    const mistCount = Math.floor(10 * intensity);
    for (let i = 0; i < mistCount; i++) {
      particles.push({ id: generateId(), type: 'mist', x: x + random(-25, 25), y: y + 30, progress: 0, maxProgress: 40, delay: random(10, 30), alpha: 0, size: random(8, 15), vy: random(-0.5, -1), vx: random(-0.5, 0.5), color: '#aaddff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WaterfallParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.x += p.vx;
    if (p.type === 'fall') {
      p.alpha = 0.8;
    } else {
      p.alpha = (1 - t) * 0.4;
      p.size += 0.2;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WaterfallParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'mist') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = p.color;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
