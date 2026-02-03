/**
 * Wave4 エフェクト
 * ウェーブ4 + 波動4 + うねり
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#88ccff'];
interface Wave4Particle extends Particle { type: 'wave'; width: number; amplitude: number; phase: number; frequency: number; color: string; }
export const wave4Effect: Effect = {
  config: { name: 'wave4', description: 'ウェーブ4 + 波動4', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Wave4Particle[] = [];
    const count = Math.floor(4 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'wave', x: x - 60, y: y + (i - 1.5) * 15, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, width: 120, amplitude: random(8, 15), phase: i * 0.5, frequency: random(0.15, 0.25), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Wave4Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += p.frequency;
    p.alpha = Math.sin(t * Math.PI) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Wave4Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i <= 30; i++) {
      const px = p.x + (i / 30) * p.width;
      const py = p.y + Math.sin(p.phase + i * 0.3) * p.amplitude;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  },
};
