/**
 * Hail エフェクト
 * 雹 + 落下 + 跳ね返り
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ccddee', '#aabbcc', '#88aacc'];

interface HailParticle extends Particle {
  type: 'hail' | 'splash' | 'bounce';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  bounced: boolean;
  color: string;
}

export const hailEffect: Effect = {
  config: { name: 'hail', description: '雹 + 落下', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HailParticle[] = [];

    // Hailstones
    const hailCount = Math.floor(15 * intensity);
    for (let i = 0; i < hailCount; i++) {
      particles.push({
        id: generateId(), type: 'hail', x, y, progress: 0,
        maxProgress: 40 + random(0, 20), delay: random(0, 30), alpha: 0,
        size: random(5, 12), currentX: x + random(-80, 80), currentY: y - random(50, 100),
        vx: random(-1, 1), vy: random(5, 10), bounced: false,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Splash particles
    const splashCount = Math.floor(20 * intensity);
    for (let i = 0; i < splashCount; i++) {
      const angle = random(0, Math.PI);
      particles.push({
        id: generateId(), type: 'splash', x, y, progress: 0,
        maxProgress: 25, delay: random(10, 40), alpha: 0,
        size: random(2, 4), currentX: x + random(-60, 60), currentY: y + 20,
        vx: Math.cos(angle) * random(2, 5), vy: -random(2, 5), bounced: false,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HailParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'hail') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vy += 0.3;

      // Bounce when hitting ground
      if (p.currentY > p.y + 30 && !p.bounced) {
        p.bounced = true;
        p.vy = -p.vy * 0.4;
        p.vx = random(-2, 2);
      }

      p.alpha = t < 0.1 ? t / 0.1 : 1 - (t - 0.1) / 0.9 * 0.5;
    } else {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vy += 0.2;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HailParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'hail') {
      // Ice ball with highlight
      const g = ctx.createRadialGradient(
        p.currentX - p.size * 0.3, p.currentY - p.size * 0.3, 0,
        p.currentX, p.currentY, p.size
      );
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.4, p.color);
      g.addColorStop(1, p.color + '88');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
