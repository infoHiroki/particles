/**
 * Squash エフェクト
 * スカッシュ + 潰れ + 圧縮
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6699', '#ff88aa', '#ffaabb'];
interface SquashParticle extends Particle { type: 'ball'; size: number; scaleX: number; scaleY: number; vy: number; onGround: boolean; color: string; }
export const squashEffect: Effect = {
  config: { name: 'squash', description: 'スカッシュ + 潰れ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SquashParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'ball', x: x + random(-30, 30), y: y - 30, progress: 0, maxProgress: 50, delay: i * 6, alpha: 0, size: random(10, 15), scaleX: 1, scaleY: 1, vy: 0, onGround: false, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SquashParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (!p.onGround) {
      p.vy += 0.5;
      p.y += p.vy;
      if (p.y >= p.y + 30) {
        p.onGround = true;
        p.scaleX = 1.5;
        p.scaleY = 0.5;
      }
    } else {
      p.scaleX = 1 + (p.scaleX - 1) * 0.8;
      p.scaleY = 1 + (p.scaleY - 1) * 0.8;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SquashParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.scale(p.scaleX, p.scaleY);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
