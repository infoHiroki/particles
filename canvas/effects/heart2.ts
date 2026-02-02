/**
 * Heart2 エフェクト
 * ハート + 愛 + 恋
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4466', '#ff6688', '#ffaacc'];
interface Heart2Particle extends Particle { type: 'heart'; size: number; vy: number; color: string; }
export const heart2Effect: Effect = {
  config: { name: 'heart2', description: 'ハート + 愛', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Heart2Particle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'heart', x: x + random(-25, 25), y: y + random(-15, 15), progress: 0, maxProgress: 50, delay: i * 4, alpha: 0, size: random(10, 18), vy: random(-1, -0.5), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Heart2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Heart2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y + p.size * 0.3);
    ctx.bezierCurveTo(p.x - p.size, p.y - p.size * 0.3, p.x - p.size, p.y + p.size * 0.5, p.x, p.y + p.size);
    ctx.bezierCurveTo(p.x + p.size, p.y + p.size * 0.5, p.x + p.size, p.y - p.size * 0.3, p.x, p.y + p.size * 0.3);
    ctx.fill();
    ctx.restore();
  },
};
