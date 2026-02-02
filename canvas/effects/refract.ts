/**
 * Refract エフェクト
 * 屈折 + 歪み + 曲がり
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ccff', '#66aadd', '#4488bb'];
interface RefractParticle extends Particle { type: 'ray'; size: number; bendAngle: number; length: number; color: string; }
export const refractEffect: Effect = {
  config: { name: 'refract', description: '屈折 + 歪み', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RefractParticle[] = [];
    const count = Math.floor(6 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'ray', x: x + random(-20, 20), y: y - 30, progress: 0, maxProgress: 45, delay: i * 4, alpha: 0, size: random(2, 3), bendAngle: random(0.3, 0.6), length: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RefractParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.length = t * 50;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RefractParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    const midY = p.y + 30;
    ctx.lineTo(p.x, midY);
    ctx.lineTo(p.x + Math.sin(p.bendAngle) * p.length, midY + p.length);
    ctx.stroke();
    ctx.restore();
  },
};
