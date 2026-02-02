/**
 * Sandstorm エフェクト
 * 砂嵐 + 風 + 粒子
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ccaa77', '#bb9966', '#aa8855'];

interface SandstormParticle extends Particle {
  type: 'sand' | 'dust' | 'debris';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
}

export const sandstormEffect: Effect = {
  config: { name: 'sandstorm', description: '砂嵐 + 風', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SandstormParticle[] = [];

    // Sand particles
    const sandCount = Math.floor(40 * intensity);
    for (let i = 0; i < sandCount; i++) {
      particles.push({
        id: generateId(), type: 'sand', x, y, progress: 0,
        maxProgress: 50 + random(0, 30), delay: random(0, 30), alpha: 0,
        size: random(1, 3), currentX: x - 100 + random(-20, 20), currentY: y + random(-60, 60),
        vx: random(8, 15), vy: random(-1, 1), rotation: 0,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Dust clouds
    const dustCount = Math.floor(10 * intensity);
    for (let i = 0; i < dustCount; i++) {
      particles.push({
        id: generateId(), type: 'dust', x, y, progress: 0,
        maxProgress: 60 + random(0, 20), delay: random(0, 25), alpha: 0,
        size: random(30, 60), currentX: x - 80 + random(-20, 20), currentY: y + random(-40, 40),
        vx: random(4, 8), vy: random(-0.5, 0.5), rotation: 0,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Debris
    const debrisCount = Math.floor(8 * intensity);
    for (let i = 0; i < debrisCount; i++) {
      particles.push({
        id: generateId(), type: 'debris', x, y, progress: 0,
        maxProgress: 40 + random(0, 20), delay: random(0, 20), alpha: 0,
        size: random(4, 8), currentX: x - 60, currentY: y + random(-50, 50),
        vx: random(10, 18), vy: random(-2, 2), rotation: random(0, Math.PI * 2),
        color: '#776655',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SandstormParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    p.currentX += p.vx;
    p.currentY += p.vy + Math.sin(p.progress * 0.2) * 0.5;

    if (p.type === 'sand') {
      p.alpha = t < 0.1 ? t / 0.1 : (1 - t) / 0.9 * 0.8;
    } else if (p.type === 'dust') {
      p.size += 0.3;
      p.alpha = (t < 0.2 ? t / 0.2 : (1 - t) / 0.8) * 0.4;
    } else {
      p.rotation += 0.15;
      p.alpha = t < 0.1 ? t / 0.1 : 1 - (t - 0.1) / 0.9;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SandstormParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'sand') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'dust') {
      const g = ctx.createRadialGradient(p.currentX, p.currentY, 0, p.currentX, p.currentY, p.size);
      g.addColorStop(0, p.color + '60');
      g.addColorStop(0.6, p.color + '30');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.translate(p.currentX, p.currentY);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    ctx.restore();
  },
};
