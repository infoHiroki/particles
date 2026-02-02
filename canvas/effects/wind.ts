/**
 * Wind エフェクト
 * 風 + 流線 + 揺らぎ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#cccccc', '#aaaaaa', '#ffffff'];

interface WindParticle extends Particle {
  type: 'wind'; size: number; vx: number; vy: number; length: number;
  currentX: number; currentY: number; color: string;
}

export const windEffect: Effect = {
  config: { name: 'wind', description: '風 + 流線', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: WindParticle[] = [];
    const count = Math.floor(40 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({
        id: generateId(), type: 'wind', x: x - 100 + random(-50, 50), y: y + random(-80, 80),
        progress: 0, maxProgress: 40 + random(0, 20), delay: random(0, 20), alpha: 0,
        size: random(1, 2), vx: random(8, 15), vy: random(-1, 1),
        length: random(20, 50), currentX: x - 100 + random(-50, 50),
        currentY: y + random(-80, 80), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WindParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.currentX += p.vx; p.currentY += p.vy + Math.sin(p.progress * 0.2) * 0.5;
    p.alpha = t < 0.2 ? t / 0.2 * 0.6 : 0.6 * (1 - (t - 0.2) / 0.8);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WindParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color; ctx.lineWidth = p.size; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(p.currentX - p.length, p.currentY);
    ctx.lineTo(p.currentX, p.currentY); ctx.stroke(); ctx.restore();
  },
};
