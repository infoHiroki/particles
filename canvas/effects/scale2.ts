/**
 * Scale2 エフェクト
 * スケール + 拡縮 + 変形
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44ffaa', '#66ffcc', '#ffffff'];
interface Scale2Particle extends Particle { type: 'shape' | 'ring'; size: number; scale: number; targetScale: number; color: string; }
export const scale2Effect: Effect = {
  config: { name: 'scale2', description: 'スケール + 拡縮', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Scale2Particle[] = [];
    particles.push({ id: generateId(), type: 'shape', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 30, scale: 0.1, targetScale: 1.5, color: DEFAULT_COLORS[0] });
    const ringCount = Math.floor(3 * intensity);
    for (let i = 0; i < ringCount; i++) {
      particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 50, delay: i * 10, alpha: 0, size: 25 + i * 10, scale: 0.1, targetScale: 1.2, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Scale2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const ease = 1 - Math.pow(1 - t, 3);
    p.scale = 0.1 + (p.targetScale - 0.1) * ease;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Scale2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.scale(p.scale, p.scale);
    if (p.type === 'shape') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
