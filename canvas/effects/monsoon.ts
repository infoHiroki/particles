/**
 * Monsoon エフェクト
 * モンスーン + 季節風 + 豪雨
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#5588aa', '#447799', '#336688'];
interface MonsoonParticle extends Particle { type: 'rain' | 'splash'; size: number; vx: number; vy: number; color: string; }
export const monsoonEffect: Effect = {
  config: { name: 'monsoon', description: 'モンスーン + 豪雨', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MonsoonParticle[] = [];
    const rainCount = Math.floor(35 * intensity);
    for (let i = 0; i < rainCount; i++) {
      particles.push({ id: generateId(), type: 'rain', x: x + random(-70, 70), y: y + random(-50, 50), progress: 0, maxProgress: 35, delay: random(0, 15), alpha: 0, size: random(1, 3), vx: random(-2, 0), vy: random(8, 12), color: DEFAULT_COLORS[i % 3] });
    }
    const splashCount = Math.floor(10 * intensity);
    for (let i = 0; i < splashCount; i++) {
      particles.push({ id: generateId(), type: 'splash', x: x + random(-50, 50), y: y + 40, progress: 0, maxProgress: 20, delay: random(15, 30), alpha: 0, size: random(2, 4), vx: random(-2, 2), vy: random(-3, -1), color: DEFAULT_COLORS[0] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MonsoonParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'splash') {
      p.vy += 0.3;
    }
    p.alpha = p.type === 'rain' ? 0.6 : (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MonsoonParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'rain') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
