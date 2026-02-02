/**
 * Chip エフェクト
 * チップ + 積み + カジノ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0000', '#00aa00', '#0000ff', '#ffcc00'];
interface ChipParticle extends Particle { type: 'chip'; size: number; stackIndex: number; vy: number; color: string; }
export const chipEffect: Effect = {
  config: { name: 'chip', description: 'チップ + 積み', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ChipParticle[] = [];
    const count = Math.floor(6 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'chip', x, y: y - 50, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 25, stackIndex: i, vy: 2, color: DEFAULT_COLORS[i % 4] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ChipParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const targetY = p.y + 50 - p.stackIndex * 5;
    if (p.y < targetY) {
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ChipParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size * 0.6, p.size * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },
};
