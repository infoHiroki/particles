/**
 * Chorus エフェクト
 * コーラス + 合唱 + 重なり
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff88aa', '#88aaff', '#aaff88'];
interface ChorusParticle extends Particle { type: 'wave'; phase: number; amplitude: number; frequency: number; yOffset: number; color: string; }
export const chorusEffect: Effect = {
  config: { name: 'chorus', description: 'コーラス + 合唱', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ChorusParticle[] = [];
    const count = Math.floor(4 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'wave', x: x - 60, y, progress: 0, maxProgress: 70, delay: i * 5, alpha: 0, phase: i * 0.5, amplitude: random(10, 20), frequency: random(0.1, 0.15), yOffset: (i - 1.5) * 15, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ChorusParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += p.frequency;
    p.alpha = Math.sin(t * Math.PI) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ChorusParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i <= 30; i++) {
      const px = p.x + i * 4;
      const py = p.y + p.yOffset + Math.sin(p.phase + i * 0.3) * p.amplitude;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  },
};
