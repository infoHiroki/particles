/**
 * Mist エフェクト
 * 霧 + 漂い + 拡散
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#aabbcc', '#99aabb', '#8899aa'];

interface MistParticle extends Particle {
  type: 'cloud' | 'wisp';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  color: string;
}

export const mistEffect: Effect = {
  config: { name: 'mist', description: '霧 + 漂い', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MistParticle[] = [];

    // Clouds
    const cloudCount = Math.floor(8 * intensity);
    for (let i = 0; i < cloudCount; i++) {
      particles.push({
        id: generateId(), type: 'cloud', x, y, progress: 0,
        maxProgress: 80 + random(0, 40), delay: random(0, 20), alpha: 0,
        size: random(40, 80), currentX: x + random(-60, 60), currentY: y + random(-30, 30),
        vx: random(-0.3, 0.3), vy: random(-0.1, 0.1),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Wisps
    const wispCount = Math.floor(15 * intensity);
    for (let i = 0; i < wispCount; i++) {
      particles.push({
        id: generateId(), type: 'wisp', x, y, progress: 0,
        maxProgress: 60 + random(0, 30), delay: random(0, 30), alpha: 0,
        size: random(15, 30), currentX: x + random(-80, 80), currentY: y + random(-40, 40),
        vx: random(-0.5, 0.5), vy: random(-0.2, 0.2),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MistParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    p.currentX += p.vx;
    p.currentY += p.vy;

    if (p.type === 'cloud') {
      p.size += 0.2;
      p.alpha = (t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1) * 0.3;
    } else {
      p.size += 0.1;
      p.alpha = (t < 0.25 ? t / 0.25 : (1 - t) / 0.75) * 0.4;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MistParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    const g = ctx.createRadialGradient(p.currentX, p.currentY, 0, p.currentX, p.currentY, p.size);
    g.addColorStop(0, p.color + '60');
    g.addColorStop(0.5, p.color + '30');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },
};
