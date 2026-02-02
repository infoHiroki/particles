/**
 * Rank エフェクト
 * ランク + 星 + 評価
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#ffdd44', '#ffffff'];
interface RankParticle extends Particle { type: 'star' | 'sparkle'; size: number; index: number; filled: boolean; color: string; }
export const rankEffect: Effect = {
  config: { name: 'rank', description: 'ランク + 星', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RankParticle[] = [];
    const starCount = 5;
    const filledCount = Math.floor(3 + intensity * 2);
    for (let i = 0; i < starCount; i++) {
      particles.push({ id: generateId(), type: 'star', x: x - 50 + i * 25, y, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 12, index: i, filled: i < filledCount, color: DEFAULT_COLORS[0] });
    }
    const sparkleCount = Math.floor(6 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-60, 60), y: y + random(-15, 15), progress: 0, maxProgress: 40, delay: 25 + i * 3, alpha: 0, size: random(2, 4), index: 0, filled: false, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RankParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RankParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'star') {
      if (p.filled) {
        ctx.fillStyle = p.color;
      } else {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
      }
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? p.size : p.size * 0.4;
        if (i === 0) ctx.moveTo(p.x + Math.cos(angle) * r, p.y + Math.sin(angle) * r);
        else ctx.lineTo(p.x + Math.cos(angle) * r, p.y + Math.sin(angle) * r);
      }
      ctx.closePath();
      if (p.filled) ctx.fill();
      else ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
