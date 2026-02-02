/**
 * Burn2 エフェクト
 * 燃焼 + 炎上 + 火傷
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4400', '#ff6600', '#ff8800'];
interface Burn2Particle extends Particle { type: 'fire'; size: number; vy: number; wobble: number; color: string; }
export const burn2Effect: Effect = {
  config: { name: 'burn2', description: '燃焼 + 炎上', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Burn2Particle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'fire', x: x + random(-20, 20), y: y + random(-10, 10), progress: 0, maxProgress: 40, delay: random(0, 15), alpha: 0, size: random(6, 12), vy: random(-2, -1), wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Burn2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.wobble += 0.2;
    p.x += Math.sin(p.wobble) * 0.5;
    p.y += p.vy;
    p.size *= 0.97;
    p.alpha = (1 - t) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Burn2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grad.addColorStop(0, '#ffff88');
    grad.addColorStop(0.5, p.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
