/**
 * Float エフェクト
 * フロート + 浮遊 + 漂い
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aaccff', '#99bbee', '#88aadd'];
interface FloatParticle extends Particle { type: 'bubble'; size: number; vy: number; wobble: number; wobbleSpeed: number; color: string; }
export const floatEffect: Effect = {
  config: { name: 'float', description: 'フロート + 浮遊', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FloatParticle[] = [];
    const count = Math.floor(10 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'bubble', x: x + random(-40, 40), y: y + random(-20, 20), progress: 0, maxProgress: 70, delay: random(0, 20), alpha: 0, size: random(5, 12), vy: random(-0.5, -0.2), wobble: random(0, Math.PI * 2), wobbleSpeed: random(0.05, 0.1), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FloatParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.wobble += p.wobbleSpeed;
    p.x += Math.sin(p.wobble) * 0.5;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FloatParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
