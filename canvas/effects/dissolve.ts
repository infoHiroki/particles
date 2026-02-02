/**
 * Dissolve エフェクト
 * 溶解 + 消失 + 散乱
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#888888', '#666666', '#aaaaaa'];

interface DissolveParticle extends Particle {
  type: 'dissolve'; size: number; vx: number; vy: number; currentX: number; currentY: number; color: string;
}

export const dissolveEffect: Effect = {
  config: { name: 'dissolve', description: '溶解 + 消失', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DissolveParticle[] = [];
    const count = Math.floor(60 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({
        id: generateId(), type: 'dissolve', x: x + random(-30, 30), y: y + random(-30, 30),
        progress: 0, maxProgress: 50 + random(0, 30), delay: random(0, 20), alpha: 1,
        size: random(2, 5), vx: random(-2, 2), vy: random(-3, -1),
        currentX: x + random(-30, 30), currentY: y + random(-30, 30),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DissolveParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.currentX += p.vx; p.currentY += p.vy;
    p.vx *= 0.98; p.vy *= 0.98;
    p.size *= 0.98;
    p.alpha = 1 - t;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DissolveParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.currentX - p.size / 2, p.currentY - p.size / 2, p.size, p.size);
    ctx.restore();
  },
};
