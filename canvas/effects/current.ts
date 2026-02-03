/**
 * Current エフェクト
 * カレント + 流れ + 潮流
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#226699', '#4488aa', '#66aacc'];
interface CurrentParticle extends Particle { type: 'flow'; size: number; baseY: number; phase: number; speed: number; color: string; }
export const currentEffect: Effect = {
  config: { name: 'current', description: 'カレント + 流れ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CurrentParticle[] = [];
    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      const py = y + random(-30, 30);
      particles.push({ id: generateId(), type: 'flow', x: x - 80 + random(0, 20), y: py, progress: 0, maxProgress: 60, delay: random(0, 20), alpha: 0, size: random(2, 5), baseY: py, phase: random(0, Math.PI * 2), speed: random(2, 4), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CurrentParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.speed;
    p.phase += 0.1;
    p.y = p.baseY + Math.sin(p.phase) * 8;
    p.alpha = Math.sin(t * Math.PI) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CurrentParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size * 1.5, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
