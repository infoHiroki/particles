/**
 * Cancel エフェクト
 * キャンセル + バツ印 + 拒否
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff4444', '#ff6666', '#ff8888'];

interface CancelParticle extends Particle {
  type: 'cross' | 'circle' | 'fragment';
  size: number;
  drawProgress: number;
  vx: number;
  vy: number;
  color: string;
}

export const cancelEffect: Effect = {
  config: { name: 'cancel', description: 'キャンセル + バツ印', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CancelParticle[] = [];

    // Circle
    particles.push({
      id: generateId(), type: 'circle', x, y, progress: 0, maxProgress: 35,
      alpha: 0, size: 35, drawProgress: 0, vx: 0, vy: 0, color: DEFAULT_COLORS[0],
    });

    // Cross
    particles.push({
      id: generateId(), type: 'cross', x, y, progress: 0, maxProgress: 45,
      delay: 8, alpha: 0, size: 20, drawProgress: 0, vx: 0, vy: 0, color: DEFAULT_COLORS[0],
    });

    // Fragments
    const fragCount = Math.floor(10 * intensity);
    for (let i = 0; i < fragCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'fragment', x, y, progress: 0, maxProgress: 30,
        delay: random(10, 25), alpha: 0, size: random(3, 6), drawProgress: 0,
        vx: Math.cos(angle) * random(3, 8), vy: Math.sin(angle) * random(3, 8),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CancelParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'circle') {
      p.drawProgress = Math.min(t * 2, 1);
      p.alpha = t < 0.1 ? t / 0.1 : t > 0.7 ? (1 - t) / 0.3 : 1;
    } else if (p.type === 'cross') {
      p.drawProgress = Math.min(t * 1.5, 1);
      p.alpha = t < 0.1 ? t / 0.1 : t > 0.7 ? (1 - t) / 0.3 : 1;
    } else {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CancelParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'circle') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p.drawProgress);
      ctx.stroke();
    } else if (p.type === 'cross') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 5;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.lineCap = 'round';

      if (p.drawProgress < 0.5) {
        const prog = p.drawProgress * 2;
        ctx.beginPath();
        ctx.moveTo(p.x - p.size, p.y - p.size);
        ctx.lineTo(
          p.x - p.size + p.size * 2 * prog,
          p.y - p.size + p.size * 2 * prog
        );
        ctx.stroke();
      } else {
        const prog = (p.drawProgress - 0.5) * 2;
        ctx.beginPath();
        ctx.moveTo(p.x - p.size, p.y - p.size);
        ctx.lineTo(p.x + p.size, p.y + p.size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p.x + p.size, p.y - p.size);
        ctx.lineTo(
          p.x + p.size - p.size * 2 * prog,
          p.y - p.size + p.size * 2 * prog
        );
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
