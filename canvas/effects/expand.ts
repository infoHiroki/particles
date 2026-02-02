/**
 * Expand エフェクト
 * 拡大 + 膨張 + 広がり
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff8866', '#88ff66', '#6688ff'];
interface ExpandParticle extends Particle { type: 'ring' | 'dot'; size: number; maxSize: number; color: string; }
export const expandEffect: Effect = {
  config: { name: 'expand', description: '拡大 + 膨張', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ExpandParticle[] = [];
    const ringCount = Math.floor(4 * intensity);
    for (let i = 0; i < ringCount; i++) {
      particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 55, delay: i * 10, alpha: 0, size: 5, maxSize: 40 + i * 15, color: DEFAULT_COLORS[i % 3] });
    }
    const dotCount = Math.floor(10 * intensity);
    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'dot', x, y, progress: 0, maxProgress: 50, delay: random(5, 20), alpha: 0, size: random(3, 6), maxSize: random(30, 50), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ExpandParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const ease = 1 - Math.pow(1 - t, 3);
    p.size = 5 + (p.maxSize - 5) * ease;
    p.alpha = (1 - t) * (p.type === 'ring' ? 0.8 : 0.6);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ExpandParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
