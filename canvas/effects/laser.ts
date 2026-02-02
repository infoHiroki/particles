/**
 * Laser エフェクト
 * レーザー + ビーム + グロー
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ff0000', '#ff4444', '#ff8888'];

interface LaserParticle extends Particle {
  type: 'beam' | 'glow' | 'spark'; angle: number; length: number; width: number;
  currentLength: number; currentX: number; currentY: number; color: string;
}

export const laserEffect: Effect = {
  config: { name: 'laser', description: 'レーザー + ビーム', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const angle = (options.angle as number) ?? 0;
    const particles: LaserParticle[] = [];
    particles.push({
      id: generateId(), type: 'beam', x, y, progress: 0, maxProgress: 30, alpha: 0,
      angle, length: 200, width: 6, currentLength: 0, currentX: x, currentY: y, color: '#ff0000',
    });
    particles.push({
      id: generateId(), type: 'glow', x, y, progress: 0, maxProgress: 35, alpha: 0,
      angle, length: 200, width: 20, currentLength: 0, currentX: x, currentY: y, color: '#ff4444',
    });
    const sparkCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({
        id: generateId(), type: 'spark', x: x + Math.cos(angle) * random(50, 200),
        y: y + Math.sin(angle) * random(50, 200), progress: 0, maxProgress: 20 + random(0, 10),
        delay: random(5, 20), alpha: 0, angle: random(0, Math.PI * 2), length: 0, width: 0,
        currentLength: 0, currentX: 0, currentY: 0, color: '#ff8888',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LaserParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'beam' || p.type === 'glow') {
      p.currentLength = p.length * (t < 0.3 ? easeOutCubic(t / 0.3) : 1);
      p.alpha = t < 0.3 ? 1 : 1 - (t - 0.3) / 0.7;
    } else {
      p.alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LaserParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    if (p.type === 'beam') {
      ctx.strokeStyle = p.color; ctx.lineWidth = p.width; ctx.lineCap = 'round';
      ctx.shadowColor = p.color; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.currentLength, p.y + Math.sin(p.angle) * p.currentLength);
      ctx.stroke();
    } else if (p.type === 'glow') {
      ctx.strokeStyle = p.color + '40'; ctx.lineWidth = p.width; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.currentLength, p.y + Math.sin(p.angle) * p.currentLength);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
};
