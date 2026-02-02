/**
 * Rise エフェクト
 * ライズ + 上昇 + 浮上
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffdd44', '#ffcc33', '#ffbb22'];
interface RiseParticle extends Particle { type: 'glow'; size: number; vy: number; wobble: number; color: string; }
export const riseEffect: Effect = {
  config: { name: 'rise', description: 'ライズ + 上昇', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RiseParticle[] = [];
    const count = Math.floor(10 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'glow', x: x + random(-25, 25), y: y + random(-10, 10), progress: 0, maxProgress: 55, delay: random(0, 15), alpha: 0, size: random(6, 12), vy: random(-2, -1), wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RiseParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.wobble += 0.1;
    p.x += Math.sin(p.wobble) * 0.3;
    p.y += p.vy;
    p.size *= 0.99;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RiseParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grad.addColorStop(0, p.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
