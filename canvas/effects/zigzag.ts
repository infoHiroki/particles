/**
 * Zigzag エフェクト
 * ジグザグ + 稲妻模様 + ギザギザ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#ffdd44', '#ffee88'];
interface ZigzagParticle extends Particle { type: 'line'; size: number; offset: number; color: string; }
export const zigzagEffect: Effect = {
  config: { name: 'zigzag', description: 'ジグザグ + 稲妻模様', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ZigzagParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'line', x, y, progress: 0, maxProgress: 50, delay: i * 5, alpha: 0, size: 50, offset: (i - count / 2) * 20, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ZigzagParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ZigzagParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    const startX = p.x - p.size;
    const baseY = p.y + p.offset;
    ctx.moveTo(startX, baseY);
    for (let i = 0; i < 8; i++) {
      const px = startX + (i + 1) * (p.size * 2 / 8);
      const py = baseY + (i % 2 === 0 ? -10 : 10);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  },
};
