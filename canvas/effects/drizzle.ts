/**
 * Drizzle エフェクト
 * 霧雨 + 小雨 + しとしと
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#99aacc', '#8899bb', '#7788aa'];
interface DrizzleParticle extends Particle { type: 'drop'; size: number; vy: number; color: string; }
export const drizzleEffect: Effect = {
  config: { name: 'drizzle', description: '霧雨 + 小雨', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DrizzleParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'drop', x: x + random(-50, 50), y: y + random(-30, 30), progress: 0, maxProgress: 50, delay: random(0, 25), alpha: 0, size: random(1, 2), vy: random(2, 4), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DrizzleParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.alpha = 0.5;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DrizzleParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, p.y + 8);
    ctx.stroke();
    ctx.restore();
  },
};
