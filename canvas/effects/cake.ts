/**
 * Cake エフェクト
 * ケーキ + クリーム + お祝い
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcccc', '#ff8888', '#ffffff'];
interface CakeParticle extends Particle { type: 'cake' | 'cream' | 'candle' | 'spark'; size: number; vy: number; flickerPhase: number; color: string; }
export const cakeEffect: Effect = {
  config: { name: 'cake', description: 'ケーキ + お祝い', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CakeParticle[] = [];
    particles.push({ id: generateId(), type: 'cake', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 30, vy: 0, flickerPhase: 0, color: '#ffaaaa' });
    particles.push({ id: generateId(), type: 'cream', x, y: y - 15, progress: 0, maxProgress: 55, delay: 3, alpha: 0, size: 32, vy: 0, flickerPhase: 0, color: DEFAULT_COLORS[2] });
    particles.push({ id: generateId(), type: 'candle', x, y: y - 30, progress: 0, maxProgress: 55, delay: 5, alpha: 0, size: 4, vy: 0, flickerPhase: random(0, Math.PI * 2), color: '#ff6600' });
    const sparkCount = Math.floor(6 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({ id: generateId(), type: 'spark', x: x + random(-5, 5), y: y - 40, progress: 0, maxProgress: 35, delay: random(10, 30), alpha: 0, size: random(2, 3), vy: -random(0.5, 1.5), flickerPhase: random(0, Math.PI * 2), color: '#ffdd00' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CakeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'spark') {
      p.y += p.vy;
      p.x += Math.sin(p.progress * 0.3) * 0.3;
    }
    p.flickerPhase += 0.3;
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CakeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'cake') {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size, p.y - p.size * 0.5, p.size * 2, p.size);
      ctx.fillStyle = '#cc8888';
      ctx.fillRect(p.x - p.size, p.y + p.size * 0.3, p.size * 2, p.size * 0.2);
    } else if (p.type === 'cream') {
      ctx.fillStyle = p.color;
      for (let i = 0; i < 5; i++) {
        const cx = p.x - p.size + i * (p.size * 0.5);
        ctx.beginPath();
        ctx.arc(cx, p.y, p.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (p.type === 'candle') {
      ctx.fillStyle = '#ffcccc';
      ctx.fillRect(p.x - p.size * 0.5, p.y, p.size, p.size * 4);
      const flicker = Math.sin(p.flickerPhase) * 2;
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 8 + flicker);
      ctx.quadraticCurveTo(p.x + 4, p.y - 4, p.x, p.y);
      ctx.quadraticCurveTo(p.x - 4, p.y - 4, p.x, p.y - 8 + flicker);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
