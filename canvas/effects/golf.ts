/**
 * Golf エフェクト
 * ゴルフ + ボール + ホールインワン
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#44aa44', '#ddcc88'];
interface GolfParticle extends Particle { type: 'ball' | 'divot' | 'flag'; size: number; vx: number; vy: number; color: string; }
export const golfEffect: Effect = {
  config: { name: 'golf', description: 'ゴルフ + ホールインワン', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GolfParticle[] = [];
    particles.push({ id: generateId(), type: 'ball', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 8, vx: 3, vy: -4, color: DEFAULT_COLORS[0] });
    const divotCount = Math.floor(10 * intensity);
    for (let i = 0; i < divotCount; i++) {
      particles.push({ id: generateId(), type: 'divot', x: x + random(-10, 10), y: y + random(0, 10), progress: 0, maxProgress: 40, delay: random(0, 8), alpha: 0, size: random(2, 4), vx: random(-1.5, 1.5), vy: random(-2, -0.5), color: i % 2 === 0 ? DEFAULT_COLORS[1] : DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GolfParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'ball') {
      p.vy += 0.12;
      p.vx *= 0.99;
    } else {
      p.vy += 0.08;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.75 ? (1 - t) / 0.25 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GolfParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'ball') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#888888';
      ctx.shadowBlur = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
