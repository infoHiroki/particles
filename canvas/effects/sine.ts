/**
 * Sine エフェクト
 * サイン波 + 波形 + 振動
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ffaa', '#44ffbb', '#88ffcc'];
interface SineParticle extends Particle { type: 'wave'; size: number; phase: number; amplitude: number; frequency: number; color: string; }
export const sineEffect: Effect = {
  config: { name: 'sine', description: 'サイン波 + 波形', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SineParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'wave', x, y: y + (i - 1) * 20, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 2, phase: 0, amplitude: random(15, 25), frequency: random(0.1, 0.15), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SineParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += p.frequency;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SineParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const px = p.x - 60 + i * 3;
      const py = p.y + Math.sin(p.phase + i * 0.3) * p.amplitude;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  },
};
