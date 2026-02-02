/**
 * Grab エフェクト
 * 掴み + 締め付け + 圧力
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff6688', '#ff4466', '#ff2244'];

interface GrabParticle extends Particle {
  type: 'grip' | 'pressure' | 'spark';
  size: number;
  angle: number;
  targetSize: number;
  color: string;
}

export const grabEffect: Effect = {
  config: { name: 'grab', description: '掴み + 締め付け', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GrabParticle[] = [];

    // Grip lines (converging)
    const gripCount = 6;
    for (let i = 0; i < gripCount; i++) {
      const angle = (i / gripCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'grip', x, y, progress: 0, maxProgress: 30,
        delay: i * 2, alpha: 0, size: 60, angle, targetSize: 15,
        color: DEFAULT_COLORS[i % 3],
      });
    }

    // Pressure rings
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(), type: 'pressure', x, y, progress: 0, maxProgress: 35,
        delay: 10 + i * 5, alpha: 0, size: 40 - i * 10, angle: 0, targetSize: 0,
        color: DEFAULT_COLORS[0],
      });
    }

    // Sparks
    const sparkCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 25,
        delay: random(5, 20), alpha: 0, size: random(2, 4), angle,
        targetSize: random(20, 40), color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GrabParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'grip') {
      p.size = 60 - t * (60 - p.targetSize);
      p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7;
    } else if (p.type === 'pressure') {
      p.size *= 0.95;
      p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7 * 0.6;
    } else {
      p.targetSize -= 1;
      if (p.targetSize < 5) p.targetSize = 5;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GrabParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'grip') {
      const startX = p.x + Math.cos(p.angle) * p.size;
      const startY = p.y + Math.sin(p.angle) * p.size;
      const endX = p.x + Math.cos(p.angle) * p.targetSize;
      const endY = p.y + Math.sin(p.angle) * p.targetSize;

      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    } else if (p.type === 'pressure') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const px = p.x + Math.cos(p.angle) * p.targetSize;
      const py = p.y + Math.sin(p.angle) * p.targetSize;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
