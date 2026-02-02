/**
 * Wave2 エフェクト
 * 波模様 + ウェーブ + 波線
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488cc', '#5599dd', '#66aaee'];
interface Wave2Particle extends Particle { type: 'wave'; size: number; offset: number; phase: number; color: string; }
export const wave2Effect: Effect = {
  config: { name: 'wave2', description: '波模様 + ウェーブ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Wave2Particle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 60, offset: (i - count / 2) * 15, phase: i * 0.5, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Wave2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.1;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Wave2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) {
      const px = p.x - p.size + (i / 20) * p.size * 2;
      const py = p.y + p.offset + Math.sin((i / 20) * Math.PI * 2 + p.phase) * 10;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  },
};
