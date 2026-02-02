/**
 * Zoom2 エフェクト
 * ズーム + 拡大 + 焦点
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#aaaaaa', '#4488ff'];
interface Zoom2Particle extends Particle { type: 'ring' | 'line'; size: number; maxSize: number; angle: number; color: string; }
export const zoom2Effect: Effect = {
  config: { name: 'zoom2', description: 'ズーム + 拡大', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Zoom2Particle[] = [];
    const ringCount = Math.floor(3 * intensity);
    for (let i = 0; i < ringCount; i++) {
      particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 50, delay: i * 10, alpha: 0, size: 5, maxSize: 50 + i * 15, angle: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const lineCount = Math.floor(8 * intensity);
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'line', x, y, progress: 0, maxProgress: 40, delay: 5, alpha: 0, size: 20, maxSize: 50, angle, color: DEFAULT_COLORS[0] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Zoom2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.size = 5 + (p.maxSize - 5) * t;
    p.alpha = (1 - t) * 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Zoom2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x + Math.cos(p.angle) * 10, p.y + Math.sin(p.angle) * 10);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.size, p.y + Math.sin(p.angle) * p.size);
      ctx.stroke();
    }
    ctx.restore();
  },
};
