/**
 * Shockwave エフェクト
 * 衝撃波 + 歪み + 拡散
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ffffff', '#aaccff'];

interface ShockParticle extends Particle {
  type: 'ring' | 'debris'; radius: number; maxRadius: number; thickness: number;
  angle: number; distance: number; currentX: number; currentY: number; color: string;
}

export const shockwaveEffect: Effect = {
  config: { name: 'shockwave', description: '衝撃波 + 歪み', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ShockParticle[] = [];
    particles.push({
      id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 30, alpha: 0,
      radius: 10, maxRadius: 120, thickness: 5, angle: 0, distance: 0, currentX: x, currentY: y, color: '#ffffff',
    });
    particles.push({
      id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 40, delay: 5, alpha: 0,
      radius: 10, maxRadius: 90, thickness: 3, angle: 0, distance: 0, currentX: x, currentY: y, color: '#aaccff',
    });
    const debrisCount = Math.floor(20 * intensity);
    for (let i = 0; i < debrisCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'debris', x, y, progress: 0, maxProgress: 25 + random(0, 15),
        alpha: 0, radius: random(2, 4), maxRadius: 0, thickness: 0, angle, distance: random(60, 100),
        currentX: x, currentY: y, color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ShockParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'ring') {
      p.radius = 10 + (p.maxRadius - 10) * easeOutCubic(t);
      p.thickness = 5 * (1 - t);
      p.alpha = 1 - easeOutCubic(t);
    } else {
      const eased = easeOutCubic(t);
      p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
      p.currentY = p.y + Math.sin(p.angle) * p.distance * eased;
      p.alpha = 1 - eased;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ShockParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    if (p.type === 'ring') {
      ctx.strokeStyle = p.color; ctx.lineWidth = p.thickness;
      ctx.shadowColor = p.color; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.fillStyle = p.color; ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
};
