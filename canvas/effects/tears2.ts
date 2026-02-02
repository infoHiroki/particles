/**
 * Tears2 エフェクト
 * 涙 + 悲しみ + 泣き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ccff', '#aaddff', '#66aaff'];
interface Tears2Particle extends Particle { type: 'tear' | 'stream'; size: number; vy: number; side: number; color: string; }
export const tears2Effect: Effect = {
  config: { name: 'tears2', description: '涙 + 悲しみ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Tears2Particle[] = [];
    particles.push({ id: generateId(), type: 'stream', x: x - 15, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 3, vy: 0, side: -1, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'stream', x: x + 15, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 3, vy: 0, side: 1, color: DEFAULT_COLORS[0] });
    const tearCount = Math.floor(8 * intensity);
    for (let i = 0; i < tearCount; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      particles.push({ id: generateId(), type: 'tear', x: x + side * 15, y, progress: 0, maxProgress: 40, delay: i * 5, alpha: 0, size: random(3, 6), vy: random(1.5, 3), side, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Tears2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'tear') {
      p.y += p.vy;
      p.alpha = 1 - t;
    } else {
      p.alpha = Math.sin(t * Math.PI) * 0.4;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Tears2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'stream') {
      ctx.fillRect(p.x - p.size / 2, p.y, p.size, 30);
    } else {
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
