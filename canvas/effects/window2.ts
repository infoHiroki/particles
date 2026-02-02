/**
 * Window2 エフェクト
 * 窓 + 光 + フレーム
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ccff', '#aaddff', '#555555'];
interface Window2Particle extends Particle { type: 'frame' | 'glass' | 'light'; size: number; color: string; }
export const window2Effect: Effect = {
  config: { name: 'window2', description: '窓 + 光', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Window2Particle[] = [];
    particles.push({ id: generateId(), type: 'frame', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 30, color: DEFAULT_COLORS[2] });
    particles.push({ id: generateId(), type: 'glass', x, y, progress: 0, maxProgress: 60, delay: 5, alpha: 0, size: 26, color: DEFAULT_COLORS[0] });
    const lightCount = Math.floor(5 * intensity);
    for (let i = 0; i < lightCount; i++) {
      particles.push({ id: generateId(), type: 'light', x: x + random(-10, 10), y: y + random(-10, 10), progress: 0, maxProgress: 40, delay: 15 + i * 5, alpha: 0, size: random(2, 4), color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Window2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI) * (p.type === 'light' ? 0.8 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Window2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'frame') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.strokeRect(p.x - p.size / 2, p.y - p.size * 0.7, p.size, p.size * 1.4);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size * 0.7);
      ctx.lineTo(p.x, p.y + p.size * 0.7);
      ctx.moveTo(p.x - p.size / 2, p.y);
      ctx.lineTo(p.x + p.size / 2, p.y);
      ctx.stroke();
    } else if (p.type === 'glass') {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * 0.5;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size * 0.7, p.size, p.size * 1.4);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
