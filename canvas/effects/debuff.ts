/**
 * Debuff エフェクト
 * デバフ + 下降矢印 + 紫オーラ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#aa44ff', '#8844cc', '#6644aa'];

interface DebuffParticle extends Particle {
  type: 'arrow' | 'aura' | 'drip';
  size: number;
  currentX: number;
  currentY: number;
  vy: number;
  color: string;
}

export const debuffEffect: Effect = {
  config: { name: 'debuff', description: 'デバフ + 下降', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DebuffParticle[] = [];

    // Aura
    particles.push({
      id: generateId(), type: 'aura', x, y, progress: 0, maxProgress: 50,
      alpha: 0, size: 40, currentX: x, currentY: y, vy: 0, color: DEFAULT_COLORS[0],
    });

    // Falling arrows
    const arrowCount = Math.floor(5 * intensity);
    for (let i = 0; i < arrowCount; i++) {
      particles.push({
        id: generateId(), type: 'arrow', x, y, progress: 0, maxProgress: 40,
        delay: i * 5, alpha: 0, size: 12,
        currentX: x + random(-25, 25), currentY: y - random(20, 40),
        vy: random(2.5, 4), color: DEFAULT_COLORS[0],
      });
    }

    // Drips
    const dripCount = Math.floor(8 * intensity);
    for (let i = 0; i < dripCount; i++) {
      particles.push({
        id: generateId(), type: 'drip', x, y, progress: 0, maxProgress: 45,
        delay: random(0, 20), alpha: 0, size: random(2, 5),
        currentX: x + random(-30, 30), currentY: y + random(-10, 10),
        vy: random(1, 2.5), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DebuffParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'aura') {
      p.size = 40 + Math.sin(p.progress * 0.12) * 6;
      p.alpha = (t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1) * 0.4;
    } else if (p.type === 'arrow') {
      p.currentY += p.vy;
      p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    } else {
      p.currentY += p.vy;
      p.size *= 0.98;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DebuffParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'aura') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '50');
      g.addColorStop(0.6, p.color + '25');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'arrow') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(p.currentX, p.currentY + p.size);
      ctx.lineTo(p.currentX + p.size * 0.6, p.currentY);
      ctx.lineTo(p.currentX + p.size * 0.2, p.currentY);
      ctx.lineTo(p.currentX + p.size * 0.2, p.currentY - p.size * 0.6);
      ctx.lineTo(p.currentX - p.size * 0.2, p.currentY - p.size * 0.6);
      ctx.lineTo(p.currentX - p.size * 0.2, p.currentY);
      ctx.lineTo(p.currentX - p.size * 0.6, p.currentY);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.currentX, p.currentY, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
