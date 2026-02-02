/**
 * Drop エフェクト
 * 雫 + 水滴 + 滴
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ccff', '#66aadd', '#4488bb'];
interface DropParticle extends Particle { type: 'drop'; size: number; vy: number; color: string; }
export const dropEffect: Effect = {
  config: { name: 'drop', description: '雫 + 水滴', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DropParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'drop', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 45, delay: i * 4, alpha: 0, size: random(6, 12), vy: random(1, 3), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DropParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.vy += 0.1;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DropParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - p.size);
    ctx.quadraticCurveTo(p.x + p.size * 0.6, p.y, p.x, p.y + p.size * 0.5);
    ctx.quadraticCurveTo(p.x - p.size * 0.6, p.y, p.x, p.y - p.size);
    ctx.fill();
    ctx.restore();
  },
};
