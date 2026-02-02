/**
 * Beer エフェクト
 * ビール + 泡 + 乾杯
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#ffdd44', '#ffffff'];
interface BeerParticle extends Particle { type: 'glass' | 'foam' | 'bubble'; size: number; vy: number; wobble: number; color: string; }
export const beerEffect: Effect = {
  config: { name: 'beer', description: 'ビール + 泡', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BeerParticle[] = [];
    particles.push({ id: generateId(), type: 'glass', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 22, vy: 0, wobble: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'foam', x, y: y - 18, progress: 0, maxProgress: 55, delay: 3, alpha: 0, size: 24, vy: 0, wobble: 0, color: DEFAULT_COLORS[2] });
    const bubbleCount = Math.floor(10 * intensity);
    for (let i = 0; i < bubbleCount; i++) {
      particles.push({ id: generateId(), type: 'bubble', x: x + random(-12, 12), y: y + random(-5, 15), progress: 0, maxProgress: 45, delay: random(5, 30), alpha: 0, size: random(2, 4), vy: -random(0.5, 1.2), wobble: random(0, Math.PI * 2), color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BeerParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'bubble') {
      p.y += p.vy;
      p.wobble += 0.15;
      p.x += Math.sin(p.wobble) * 0.3;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BeerParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'glass') {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size, p.y - p.size);
      ctx.lineTo(p.x - p.size * 0.85, p.y + p.size);
      ctx.lineTo(p.x + p.size * 0.85, p.y + p.size);
      ctx.lineTo(p.x + p.size, p.y - p.size);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size * 0.9, p.y - p.size * 0.7);
      ctx.lineTo(p.x - p.size * 0.8, p.y + p.size * 0.9);
      ctx.lineTo(p.x + p.size * 0.8, p.y + p.size * 0.9);
      ctx.lineTo(p.x + p.size * 0.9, p.y - p.size * 0.7);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'foam') {
      ctx.fillStyle = p.color;
      for (let i = 0; i < 5; i++) {
        const bx = p.x - p.size * 0.8 + i * (p.size * 0.4);
        ctx.beginPath();
        ctx.arc(bx, p.y, p.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
