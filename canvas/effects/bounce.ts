/**
 * Bounce エフェクト
 * 弾む + 跳ねる + 弾力
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff8844', '#44ff88', '#4488ff'];
interface BounceParticle extends Particle { type: 'ball'; size: number; vx: number; vy: number; gravity: number; bounce: number; color: string; }
export const bounceEffect: Effect = {
  config: { name: 'bounce', description: '弾む + 跳ねる', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BounceParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'ball', x: x + random(-30, 30), y, progress: 0, maxProgress: 80, delay: i * 3, alpha: 0, size: random(8, 14), vx: random(-1, 1), vy: random(-4, -2), gravity: 0.15, bounce: 0.7, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BounceParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    if (p.y > p.y + 30) {
      p.vy = -p.vy * p.bounce;
      p.y = p.y + 30;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BounceParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
