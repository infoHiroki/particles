/**
 * Dodge エフェクト
 * 回避 + 残像 + 風
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#aaddff', '#88ccff', '#66bbff'];

interface DodgeParticle extends Particle {
  type: 'afterimage' | 'wind' | 'sparkle';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  color: string;
}

export const dodgeEffect: Effect = {
  config: { name: 'dodge', description: '回避 + 残像', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const direction = (options.direction as number) ?? 1;
    const particles: DodgeParticle[] = [];

    // Afterimages
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(), type: 'afterimage', x: x - direction * i * 20, y,
        progress: 0, maxProgress: 25, delay: i * 3, alpha: 0,
        size: 40 - i * 5, currentX: x - direction * i * 20, currentY: y,
        vx: direction * 5, color: DEFAULT_COLORS[i],
      });
    }

    // Wind lines
    const windCount = Math.floor(10 * intensity);
    for (let i = 0; i < windCount; i++) {
      particles.push({
        id: generateId(), type: 'wind', x, y, progress: 0, maxProgress: 18,
        delay: random(0, 5), alpha: 0, size: random(25, 45),
        currentX: x - direction * random(20, 50), currentY: y + random(-35, 35),
        vx: direction * random(12, 22), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Sparkles
    const sparkleCount = Math.floor(8 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        id: generateId(), type: 'sparkle', x, y, progress: 0, maxProgress: 20,
        delay: random(0, 8), alpha: 0, size: random(2, 4),
        currentX: x + random(-30, 30), currentY: y + random(-40, 40),
        vx: direction * random(5, 10), color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DodgeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'afterimage') {
      p.currentX += p.vx;
      p.alpha = (1 - t) * 0.5;
    } else if (p.type === 'wind') {
      p.currentX += p.vx;
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    } else {
      p.currentX += p.vx;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DodgeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'afterimage') {
      ctx.fillStyle = p.color + '60';
      ctx.beginPath();
      ctx.ellipse(p.currentX, p.currentY, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'wind') {
      const g = ctx.createLinearGradient(p.currentX - p.size, p.currentY, p.currentX, p.currentY);
      g.addColorStop(0, 'transparent');
      g.addColorStop(1, p.color);
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.currentX - p.size, p.currentY);
      ctx.lineTo(p.currentX, p.currentY);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
