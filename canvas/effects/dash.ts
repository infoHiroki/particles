/**
 * Dash エフェクト
 * ダッシュ + 残像 + スピード線
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffffff', '#aaccff', '#88aaff'];

interface DashParticle extends Particle {
  type: 'line' | 'blur';
  length: number; width: number; currentX: number; currentY: number; vx: number; color: string;
}

export const dashEffect: Effect = {
  config: { name: 'dash', description: 'ダッシュ + 残像', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DashParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({
        id: generateId(), type: 'line', x: x + random(-30, 30), y: y + random(-40, 40),
        progress: 0, maxProgress: 15 + random(0, 10), delay: random(0, 5), alpha: 0,
        length: random(40, 80), width: random(1, 3),
        currentX: x + random(-30, 30), currentY: y + random(-40, 40),
        vx: random(15, 25), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DashParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.currentX += p.vx;
    p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DashParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    const g = ctx.createLinearGradient(p.currentX - p.length, p.currentY, p.currentX, p.currentY);
    g.addColorStop(0, 'transparent'); g.addColorStop(1, p.color);
    ctx.strokeStyle = g; ctx.lineWidth = p.width; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(p.currentX - p.length, p.currentY);
    ctx.lineTo(p.currentX, p.currentY); ctx.stroke();
    ctx.restore();
  },
};
