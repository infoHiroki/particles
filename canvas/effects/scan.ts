/**
 * Scan エフェクト
 * スキャン + 走査線 + データ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#00ff88', '#00ffaa', '#00ffcc'];

interface ScanParticle extends Particle {
  type: 'line' | 'data' | 'grid';
  size: number;
  currentY: number;
  speed: number;
  color: string;
}

export const scanEffect: Effect = {
  config: { name: 'scan', description: 'スキャン + 走査線', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ScanParticle[] = [];

    // Scan line
    particles.push({
      id: generateId(), type: 'line', x, y: y - 50, progress: 0, maxProgress: 40,
      alpha: 0, size: 100, currentY: y - 50, speed: 2.5, color: DEFAULT_COLORS[0],
    });

    // Grid
    particles.push({
      id: generateId(), type: 'grid', x, y, progress: 0, maxProgress: 50,
      alpha: 0, size: 80, currentY: y, speed: 0, color: DEFAULT_COLORS[1],
    });

    // Data particles
    const dataCount = Math.floor(12 * intensity);
    for (let i = 0; i < dataCount; i++) {
      particles.push({
        id: generateId(), type: 'data', x: x + random(-40, 40), y: y + random(-40, 40),
        progress: 0, maxProgress: 35, delay: random(5, 25), alpha: 0,
        size: random(2, 4), currentY: y + random(-40, 40), speed: -random(1, 2),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ScanParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'line') {
      p.currentY += p.speed;
      p.alpha = 0.8;
    } else if (p.type === 'grid') {
      p.alpha = t < 0.2 ? t / 0.2 * 0.3 : (1 - t) / 0.8 * 0.3;
    } else {
      p.currentY += p.speed;
      p.alpha = Math.random() > 0.3 ? 1 - t : 0;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ScanParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'line') {
      const g = ctx.createLinearGradient(p.x - p.size, p.currentY, p.x + p.size, p.currentY);
      g.addColorStop(0, 'transparent');
      g.addColorStop(0.3, p.color);
      g.addColorStop(0.7, p.color);
      g.addColorStop(1, 'transparent');
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size, p.currentY);
      ctx.lineTo(p.x + p.size, p.currentY);
      ctx.stroke();
    } else if (p.type === 'grid') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      const step = 20;
      for (let i = -p.size; i <= p.size; i += step) {
        ctx.beginPath();
        ctx.moveTo(p.x + i, p.y - p.size);
        ctx.lineTo(p.x + i, p.y + p.size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x - p.size, p.y + i);
        ctx.lineTo(p.x + p.size, p.y + i);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = p.color;
      ctx.font = '10px monospace';
      ctx.fillText(Math.random() > 0.5 ? '1' : '0', p.x, p.currentY);
    }
    ctx.restore();
  },
};
