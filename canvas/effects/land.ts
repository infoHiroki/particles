/**
 * Land エフェクト
 * 着地 + 衝撃 + 土埃
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#aa9977', '#998866', '#887755'];

interface LandParticle extends Particle {
  type: 'impact' | 'dust' | 'debris';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
}

export const landEffect: Effect = {
  config: { name: 'land', description: '着地 + 衝撃', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: LandParticle[] = [];

    // Impact ring
    particles.push({
      id: generateId(), type: 'impact', x, y, progress: 0, maxProgress: 20,
      alpha: 0, size: 10, currentX: x, currentY: y, vx: 0, vy: 0, rotation: 0,
      color: DEFAULT_COLORS[0],
    });

    // Dust clouds
    const dustCount = Math.floor(12 * intensity);
    for (let i = 0; i < dustCount; i++) {
      const angle = (i / dustCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'dust', x, y, progress: 0, maxProgress: 40,
        delay: random(0, 5), alpha: 0, size: random(15, 35),
        currentX: x, currentY: y,
        vx: Math.cos(angle) * random(3, 7), vy: -random(1, 4),
        rotation: 0, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Small debris
    const debrisCount = Math.floor(15 * intensity);
    for (let i = 0; i < debrisCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'debris', x, y, progress: 0, maxProgress: 30,
        delay: 0, alpha: 0, size: random(2, 5),
        currentX: x, currentY: y,
        vx: Math.cos(angle) * random(4, 10), vy: -random(3, 8),
        rotation: random(0, Math.PI * 2), color: '#665544',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LandParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'impact') {
      p.size = 10 + easeOutCubic(t) * 50;
      p.alpha = (1 - t) * 0.6;
    } else if (p.type === 'dust') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.98;
      p.size += 0.4;
      p.alpha = (t < 0.2 ? t / 0.2 : (1 - t) / 0.8) * 0.5;
    } else {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vy += 0.35;
      p.rotation += 0.15;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LandParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'impact') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
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
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
