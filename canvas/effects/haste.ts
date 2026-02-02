/**
 * Haste エフェクト
 * 加速 + スピード線 + 風
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff8844', '#ffaa66', '#ffcc88'];

interface HasteParticle extends Particle {
  type: 'line' | 'wind' | 'spark';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  length: number;
  color: string;
}

export const hasteEffect: Effect = {
  config: { name: 'haste', description: '加速 + スピード線', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HasteParticle[] = [];

    // Speed lines
    const lineCount = Math.floor(15 * intensity);
    for (let i = 0; i < lineCount; i++) {
      particles.push({
        id: generateId(), type: 'line', x, y, progress: 0, maxProgress: 20,
        delay: random(0, 10), alpha: 0, size: random(1, 2),
        currentX: x - random(20, 60), currentY: y + random(-50, 50),
        vx: random(15, 25), length: random(30, 60),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Wind particles
    const windCount = Math.floor(10 * intensity);
    for (let i = 0; i < windCount; i++) {
      particles.push({
        id: generateId(), type: 'wind', x, y, progress: 0, maxProgress: 25,
        delay: random(0, 15), alpha: 0, size: random(3, 6),
        currentX: x - random(30, 80), currentY: y + random(-40, 40),
        vx: random(8, 15), length: 0, color: '#ffffff',
      });
    }

    // Sparks
    const sparkCount = Math.floor(8 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({
        id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 18,
        delay: random(0, 8), alpha: 0, size: random(2, 4),
        currentX: x + random(-20, 20), currentY: y + random(-30, 30),
        vx: random(10, 20), length: 0, color: DEFAULT_COLORS[0],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HasteParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    p.currentX += p.vx;
    p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;

    if (p.type === 'wind') {
      p.size *= 0.95;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HasteParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'line') {
      const g = ctx.createLinearGradient(p.currentX - p.length, p.currentY, p.currentX, p.currentY);
      g.addColorStop(0, 'transparent');
      g.addColorStop(1, p.color);
      ctx.strokeStyle = g;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.currentX - p.length, p.currentY);
      ctx.lineTo(p.currentX, p.currentY);
      ctx.stroke();
    } else if (p.type === 'wind') {
      ctx.fillStyle = p.color + '60';
      ctx.beginPath();
      ctx.ellipse(p.currentX, p.currentY, p.size * 2, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
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
