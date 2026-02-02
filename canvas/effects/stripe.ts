/**
 * Stripe エフェクト
 * ストライプ + 縞模様 + 線
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6644', '#ff8866', '#ffaa88'];
interface StripeParticle extends Particle { type: 'stripe'; size: number; offset: number; color: string; }
export const stripeEffect: Effect = {
  config: { name: 'stripe', description: 'ストライプ + 縞模様', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: StripeParticle[] = [];
    const count = Math.floor(10 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'stripe', x, y, progress: 0, maxProgress: 50, delay: i * 2, alpha: 0, size: 80, offset: (i - count / 2) * 8, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StripeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI) * 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StripeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y + p.offset - 2, p.size, 4);
    ctx.restore();
  },
};
