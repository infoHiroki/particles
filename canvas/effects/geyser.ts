/**
 * Geyser エフェクト
 * 間欠泉 + 噴出 + 蒸気
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ccff', '#aaeeff', '#ffffff'];
interface GeyserParticle extends Particle { type: 'jet' | 'steam'; size: number; vx: number; vy: number; color: string; }
export const geyserEffect: Effect = {
  config: { name: 'geyser', description: '間欠泉 + 噴出', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GeyserParticle[] = [];
    const jetCount = Math.floor(20 * intensity);
    for (let i = 0; i < jetCount; i++) {
      particles.push({ id: generateId(), type: 'jet', x: x + random(-8, 8), y, progress: 0, maxProgress: 50, delay: i * 1.5, alpha: 0, size: random(4, 8), vx: random(-0.5, 0.5), vy: random(-6, -8), color: DEFAULT_COLORS[i % 2] });
    }
    const steamCount = Math.floor(15 * intensity);
    for (let i = 0; i < steamCount; i++) {
      particles.push({ id: generateId(), type: 'steam', x: x + random(-15, 15), y: y - 40, progress: 0, maxProgress: 60, delay: 20 + i * 2, alpha: 0, size: random(10, 20), vx: random(-0.3, 0.3), vy: random(-1, -2), color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GeyserParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'jet') {
      p.vy += 0.15;
      p.alpha = 1 - t;
    } else {
      p.size += 0.3;
      p.alpha = (1 - t) * 0.3;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GeyserParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'steam') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = p.color;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
