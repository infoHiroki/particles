/**
 * Buff エフェクト
 * バフ + 上昇矢印 + 緑オーラ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#44ff88', '#66ffaa', '#88ffcc'];

interface BuffParticle extends Particle {
  type: 'arrow' | 'aura' | 'sparkle';
  size: number;
  currentX: number;
  currentY: number;
  vy: number;
  rotation: number;
  color: string;
}

export const buffEffect: Effect = {
  config: { name: 'buff', description: 'バフ + 上昇', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BuffParticle[] = [];

    // Aura
    particles.push({
      id: generateId(), type: 'aura', x, y, progress: 0, maxProgress: 50,
      alpha: 0, size: 40, currentX: x, currentY: y, vy: 0, rotation: 0,
      color: DEFAULT_COLORS[0],
    });

    // Rising arrows
    const arrowCount = Math.floor(5 * intensity);
    for (let i = 0; i < arrowCount; i++) {
      particles.push({
        id: generateId(), type: 'arrow', x, y, progress: 0, maxProgress: 40,
        delay: i * 5, alpha: 0, size: 12,
        currentX: x + random(-25, 25), currentY: y + random(0, 20),
        vy: -random(2.5, 4), rotation: 0, color: DEFAULT_COLORS[0],
      });
    }

    // Sparkles
    const sparkleCount = Math.floor(8 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        id: generateId(), type: 'sparkle', x, y, progress: 0, maxProgress: 35,
        delay: random(0, 20), alpha: 0, size: random(2, 4),
        currentX: x + random(-35, 35), currentY: y + random(-35, 35),
        vy: -random(0.5, 1.5), rotation: 0, color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BuffParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'aura') {
      p.size = 40 + Math.sin(p.progress * 0.15) * 8;
      p.alpha = (t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1) * 0.5;
    } else if (p.type === 'arrow') {
      p.currentY += p.vy;
      p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    } else {
      p.currentY += p.vy;
      p.alpha = (1 - t) * Math.abs(Math.sin(p.progress * 0.4));
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BuffParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'aura') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '60');
      g.addColorStop(0.6, p.color + '30');
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
      ctx.moveTo(p.currentX, p.currentY - p.size);
      ctx.lineTo(p.currentX + p.size * 0.6, p.currentY);
      ctx.lineTo(p.currentX + p.size * 0.2, p.currentY);
      ctx.lineTo(p.currentX + p.size * 0.2, p.currentY + p.size * 0.6);
      ctx.lineTo(p.currentX - p.size * 0.2, p.currentY + p.size * 0.6);
      ctx.lineTo(p.currentX - p.size * 0.2, p.currentY);
      ctx.lineTo(p.currentX - p.size * 0.6, p.currentY);
      ctx.closePath();
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
