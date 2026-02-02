/**
 * Progress2 エフェクト
 * プログレス + バー + 進捗
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44ff44', '#ffaa00', '#4488ff'];
interface Progress2Particle extends Particle { type: 'bar' | 'fill' | 'percent'; size: number; value: number; color: string; }
export const progress2Effect: Effect = {
  config: { name: 'progress2', description: 'プログレス + バー', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: Progress2Particle[] = [];
    particles.push({ id: generateId(), type: 'bar', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 60, value: 0, color: '#333333' });
    particles.push({ id: generateId(), type: 'fill', x, y, progress: 0, maxProgress: 70, delay: 5, alpha: 0, size: 56, value: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'percent', x, y: y + 20, progress: 0, maxProgress: 70, delay: 5, alpha: 0, size: 14, value: 0, color: DEFAULT_COLORS[2] });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Progress2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type !== 'bar') {
      p.value = Math.min(100, t * 120);
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Progress2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'bar') {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - 8, p.size, 16);
    } else if (p.type === 'fill') {
      const width = (p.size * p.value) / 100;
      const hue = 120 - (p.value > 80 ? (p.value - 80) * 3 : 0);
      ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
      ctx.fillRect(p.x - p.size / 2, p.y - 6, width, 12);
    } else {
      ctx.fillStyle = p.color;
      ctx.font = `bold ${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.floor(p.value)}%`, p.x, p.y);
    }
    ctx.restore();
  },
};
