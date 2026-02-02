/**
 * Blizzard エフェクト
 * 吹雪 + 猛吹雪 + 雪嵐
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#eeeeff', '#ddddff'];
interface BlizzardParticle extends Particle { type: 'snow'; size: number; vx: number; vy: number; wobble: number; color: string; }
export const blizzardEffect: Effect = {
  config: { name: 'blizzard', description: '吹雪 + 猛吹雪', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BlizzardParticle[] = [];
    const count = Math.floor(40 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'snow', x: x + random(-80, 80), y: y + random(-50, 50), progress: 0, maxProgress: 60, delay: random(0, 20), alpha: 0, size: random(2, 5), vx: random(-5, -2), vy: random(1, 3), wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BlizzardParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.wobble += 0.2;
    p.x += p.vx + Math.sin(p.wobble) * 0.5;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BlizzardParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
