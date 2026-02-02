/**
 * Poison2 エフェクト
 * 毒 + 毒素 + 中毒
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ff00', '#66cc00', '#449900'];
interface Poison2Particle extends Particle { type: 'bubble' | 'drip'; size: number; vy: number; wobble: number; color: string; }
export const poison2Effect: Effect = {
  config: { name: 'poison2', description: '毒 + 毒素', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Poison2Particle[] = [];
    const bubbleCount = Math.floor(10 * intensity);
    for (let i = 0; i < bubbleCount; i++) {
      particles.push({ id: generateId(), type: 'bubble', x: x + random(-25, 25), y: y + random(-10, 10), progress: 0, maxProgress: 50, delay: random(0, 15), alpha: 0, size: random(3, 8), vy: random(-1, -0.3), wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    const dripCount = Math.floor(5 * intensity);
    for (let i = 0; i < dripCount; i++) {
      particles.push({ id: generateId(), type: 'drip', x: x + random(-20, 20), y, progress: 0, maxProgress: 40, delay: random(5, 20), alpha: 0, size: random(2, 4), vy: random(1, 2), wobble: 0, color: DEFAULT_COLORS[0] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Poison2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'bubble') {
      p.wobble += 0.1;
      p.x += Math.sin(p.wobble) * 0.3;
      p.y += p.vy;
    } else {
      p.y += p.vy;
      p.vy += 0.1;
    }
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Poison2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
