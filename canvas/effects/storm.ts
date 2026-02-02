/**
 * Storm エフェクト
 * 嵐 + 雷雨 + 暴風
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4477aa', '#335588', '#ffffff'];
interface StormParticle extends Particle { type: 'rain' | 'lightning'; size: number; vx: number; vy: number; color: string; }
export const stormEffect: Effect = {
  config: { name: 'storm', description: '嵐 + 雷雨', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: StormParticle[] = [];
    const rainCount = Math.floor(30 * intensity);
    for (let i = 0; i < rainCount; i++) {
      particles.push({ id: generateId(), type: 'rain', x: x + random(-60, 60), y: y + random(-40, 40), progress: 0, maxProgress: 40, delay: random(0, 15), alpha: 0, size: random(2, 4), vx: random(-3, -1), vy: random(6, 10), color: DEFAULT_COLORS[0] });
    }
    particles.push({ id: generateId(), type: 'lightning', x, y, progress: 0, maxProgress: 15, delay: 10, alpha: 0, size: 80, vx: 0, vy: 0, color: DEFAULT_COLORS[2] });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StormParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'rain') {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = 0.7;
    } else {
      p.alpha = t < 0.2 ? 1 : (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StormParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'rain') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
    }
    ctx.restore();
  },
};
