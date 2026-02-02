/**
 * Dislike エフェクト
 * ダメ + サムズダウン + 反対
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4444', '#ff6666', '#ffaaaa'];
interface DislikeParticle extends Particle { type: 'thumb' | 'x'; size: number; vx: number; vy: number; color: string; }
export const dislikeEffect: Effect = {
  config: { name: 'dislike', description: 'ダメ + サムズダウン', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DislikeParticle[] = [];
    particles.push({ id: generateId(), type: 'thumb', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 30, vx: 0, vy: 1, color: DEFAULT_COLORS[0] });
    const xCount = Math.floor(4 * intensity);
    for (let i = 0; i < xCount; i++) {
      particles.push({ id: generateId(), type: 'x', x: x + random(-25, 25), y: y + random(-25, 25), progress: 0, maxProgress: 40, delay: 10 + i * 5, alpha: 0, size: random(8, 12), vx: 0, vy: 0, color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DislikeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'thumb') {
      p.y += p.vy * (1 - t);
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DislikeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'thumb') {
      ctx.fillStyle = p.color;
      ctx.font = `${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👎', p.x, p.y);
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size / 2, p.y - p.size / 2);
      ctx.lineTo(p.x + p.size / 2, p.y + p.size / 2);
      ctx.moveTo(p.x + p.size / 2, p.y - p.size / 2);
      ctx.lineTo(p.x - p.size / 2, p.y + p.size / 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
