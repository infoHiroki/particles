/**
 * Sleepy エフェクト
 * 眠り + ZZZ + 睡眠
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#8888aa', '#aaaacc', '#6666aa'];
interface SleepyParticle extends Particle { type: 'z'; size: number; vx: number; vy: number; text: string; color: string; }
export const sleepyEffect: Effect = {
  config: { name: 'sleepy', description: '眠り + ZZZ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SleepyParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'z', x: x + 10 + i * 5, y: y - 10, progress: 0, maxProgress: 60, delay: i * 12, alpha: 0, size: 14 + i * 3, vx: 0.5, vy: -1, text: 'Z', color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SleepyParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SleepyParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.font = `bold ${p.size}px sans-serif`;
    ctx.fillStyle = p.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();
  },
};
