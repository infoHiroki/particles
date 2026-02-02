/**
 * Cut エフェクト
 * カット + 斬撃 + 切断
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#aaddff', '#88bbff'];
interface CutParticle extends Particle { type: 'slash'; size: number; startX: number; startY: number; endX: number; endY: number; drawProgress: number; color: string; }
export const cutEffect: Effect = {
  config: { name: 'cut', description: 'カット + 斬撃', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CutParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(-Math.PI / 3, Math.PI / 3);
      const length = random(50, 80);
      particles.push({ id: generateId(), type: 'slash', x, y, progress: 0, maxProgress: 25, delay: i * 5, alpha: 0, size: random(2, 4), startX: x - Math.cos(angle) * length / 2, startY: y - Math.sin(angle) * length / 2, endX: x + Math.cos(angle) * length / 2, endY: y + Math.sin(angle) * length / 2, drawProgress: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CutParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.drawProgress = Math.min(1, t * 3);
    p.alpha = t < 0.3 ? 1 : (1 - (t - 0.3) / 0.7);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CutParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.lineCap = 'round';
    const currentX = p.startX + (p.endX - p.startX) * p.drawProgress;
    const currentY = p.startY + (p.endY - p.startY) * p.drawProgress;
    ctx.beginPath();
    ctx.moveTo(p.startX, p.startY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.restore();
  },
};
