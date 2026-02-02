/**
 * Dissolve3 エフェクト
 * ディゾルブ + 溶解 + 分解
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff66aa', '#ff88cc', '#ffffff'];
interface Dissolve3Particle extends Particle { type: 'pixel'; size: number; vx: number; vy: number; startX: number; startY: number; color: string; }
export const dissolve3Effect: Effect = {
  config: { name: 'dissolve3', description: 'ディゾルブ + 溶解', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Dissolve3Particle[] = [];
    const count = Math.floor(40 * intensity);
    for (let i = 0; i < count; i++) {
      const startX = x + random(-25, 25);
      const startY = y + random(-25, 25);
      particles.push({ id: generateId(), type: 'pixel', x: startX, y: startY, progress: 0, maxProgress: 60, delay: random(0, 20), alpha: 0, size: random(3, 6), vx: random(-1, 1), vy: random(-1, 1), startX, startY, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Dissolve3Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx * t;
    p.y += p.vy * t;
    p.size = p.size * (1 - t * 0.5);
    p.alpha = 1 - t;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Dissolve3Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    ctx.restore();
  },
};
