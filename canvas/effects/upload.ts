/**
 * Upload エフェクト
 * アップロード + 上昇 + データ流
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#44ff88', '#66ffaa', '#88ffcc'];

interface UploadParticle extends Particle {
  type: 'arrow' | 'stream' | 'progress';
  size: number;
  currentY: number;
  speed: number;
  color: string;
}

export const uploadEffect: Effect = {
  config: { name: 'upload', description: 'アップロード + 上昇', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: UploadParticle[] = [];

    // Arrow
    particles.push({
      id: generateId(), type: 'arrow', x, y, progress: 0, maxProgress: 50,
      alpha: 0, size: 20, currentY: y, speed: -2, color: DEFAULT_COLORS[0],
    });

    // Progress bar
    particles.push({
      id: generateId(), type: 'progress', x, y: y + 40, progress: 0, maxProgress: 50,
      alpha: 0, size: 60, currentY: y + 40, speed: 0, color: DEFAULT_COLORS[1],
    });

    // Data streams
    const streamCount = Math.floor(15 * intensity);
    for (let i = 0; i < streamCount; i++) {
      particles.push({
        id: generateId(), type: 'stream', x: x + random(-30, 30), y: y + 20,
        progress: 0, maxProgress: 40, delay: random(0, 30), alpha: 0,
        size: random(2, 4), currentY: y + 20, speed: -random(3, 6),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as UploadParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'arrow') {
      p.currentY = p.y + Math.sin(p.progress * 0.2) * 10;
      p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    } else if (p.type === 'progress') {
      p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    } else {
      p.currentY += p.speed;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as UploadParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'arrow') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(p.x, p.currentY - p.size);
      ctx.lineTo(p.x + p.size * 0.8, p.currentY + p.size * 0.3);
      ctx.lineTo(p.x + p.size * 0.3, p.currentY + p.size * 0.3);
      ctx.lineTo(p.x + p.size * 0.3, p.currentY + p.size);
      ctx.lineTo(p.x - p.size * 0.3, p.currentY + p.size);
      ctx.lineTo(p.x - p.size * 0.3, p.currentY + p.size * 0.3);
      ctx.lineTo(p.x - p.size * 0.8, p.currentY + p.size * 0.3);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'progress') {
      const progress = (p.progress / p.maxProgress);
      ctx.strokeStyle = p.color + '40';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x - p.size / 2, p.y);
      ctx.lineTo(p.x + p.size / 2, p.y);
      ctx.stroke();

      ctx.strokeStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size / 2, p.y);
      ctx.lineTo(p.x - p.size / 2 + p.size * progress, p.y);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
