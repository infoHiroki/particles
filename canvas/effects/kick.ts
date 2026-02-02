/**
 * Kick エフェクト
 * キック + 衝撃波 + 土埃
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ff6644', '#ff4422', '#ff2200'];

interface KickParticle extends Particle {
  type: 'wave' | 'dust' | 'debris';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
}

export const kickEffect: Effect = {
  config: { name: 'kick', description: 'キック + 衝撃波', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: KickParticle[] = [];

    // Shockwave
    particles.push({
      id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 25,
      alpha: 0, size: 20, currentX: x, currentY: y, vx: 0, vy: 0, rotation: 0,
      color: DEFAULT_COLORS[0],
    });

    // Dust clouds
    const dustCount = Math.floor(10 * intensity);
    for (let i = 0; i < dustCount; i++) {
      const angle = random(-Math.PI * 0.3, Math.PI * 0.3);
      particles.push({
        id: generateId(), type: 'dust', x, y, progress: 0, maxProgress: 35,
        delay: random(0, 8), alpha: 0, size: random(15, 30),
        currentX: x + random(-20, 20), currentY: y + random(-10, 10),
        vx: Math.cos(angle) * random(3, 8), vy: Math.sin(angle) * random(2, 5) - 2,
        rotation: 0, color: '#aa9988',
      });
    }

    // Debris
    const debrisCount = Math.floor(8 * intensity);
    for (let i = 0; i < debrisCount; i++) {
      const angle = random(-Math.PI * 0.5, Math.PI * 0.5);
      particles.push({
        id: generateId(), type: 'debris', x, y, progress: 0, maxProgress: 30,
        delay: random(0, 5), alpha: 0, size: random(3, 7),
        currentX: x, currentY: y,
        vx: Math.cos(angle) * random(5, 12), vy: Math.sin(angle) * random(3, 8) - 4,
        rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as KickParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'wave') {
      p.size = 20 + easeOutCubic(t) * 60;
      p.alpha = (1 - t) * 0.6;
    } else if (p.type === 'dust') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.size += 0.3;
      p.alpha = (t < 0.2 ? t / 0.2 : (1 - t) / 0.8) * 0.5;
    } else {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vy += 0.3;
      p.rotation += 0.2;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as KickParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'wave') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, -Math.PI * 0.8, Math.PI * 0.8);
      ctx.stroke();
    } else if (p.type === 'dust') {
      const g = ctx.createRadialGradient(p.currentX, p.currentY, 0, p.currentX, p.currentY, p.size);
      g.addColorStop(0, p.color + '80');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.translate(p.currentX, p.currentY);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    }
    ctx.restore();
  },
};
