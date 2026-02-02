/**
 * Like エフェクト
 * いいね + サムズアップ + 賛成
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#ffffff'];
interface LikeParticle extends Particle { type: 'thumb' | 'sparkle'; size: number; vx: number; vy: number; color: string; }
export const likeEffect: Effect = {
  config: { name: 'like', description: 'いいね + サムズアップ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: LikeParticle[] = [];
    particles.push({ id: generateId(), type: 'thumb', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 30, vx: 0, vy: -1, color: DEFAULT_COLORS[0] });
    const sparkleCount = Math.floor(8 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-20, 20), y: y + random(-20, 20), progress: 0, maxProgress: 40, delay: 10 + random(0, 15), alpha: 0, size: random(3, 6), vx: random(-1, 1), vy: random(-1, 1), color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LikeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'thumb') {
      p.y += p.vy * (1 - t);
    } else {
      p.x += p.vx;
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LikeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'thumb') {
      ctx.fillStyle = p.color;
      ctx.font = `${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👍', p.x, p.y);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
