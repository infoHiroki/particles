/**
 * Aura2 エフェクト
 * オーラ + 気 + 霊気
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa00', '#ff8800', '#ff6600'];
interface Aura2Particle extends Particle { type: 'flame'; size: number; vy: number; wobble: number; color: string; }
export const aura2Effect: Effect = {
  config: { name: 'aura2', description: 'オーラ + 気', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Aura2Particle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'flame', x: x + random(-20, 20), y: y + random(-10, 10), progress: 0, maxProgress: 50, delay: random(0, 20), alpha: 0, size: random(8, 15), vy: random(-1.5, -0.5), wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Aura2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.wobble += 0.15;
    p.x += Math.sin(p.wobble) * 0.5;
    p.y += p.vy;
    p.size *= 0.98;
    p.alpha = (1 - t) * 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Aura2Particle;
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
