/**
 * Shake エフェクト
 * シェイク + 振動 + 揺れ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4444', '#ff6666', '#ff8888'];
interface ShakeParticle extends Particle { type: 'block'; size: number; shakeX: number; shakeY: number; color: string; }
export const shakeEffect: Effect = {
  config: { name: 'shake', description: 'シェイク + 振動', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ShakeParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'block', x: x + random(-30, 30), y: y + random(-30, 30), progress: 0, maxProgress: 40, delay: i * 3, alpha: 0, size: random(15, 25), shakeX: 0, shakeY: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ShakeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const intensity = (1 - t) * 8;
    p.shakeX = random(-intensity, intensity);
    p.shakeY = random(-intensity, intensity);
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ShakeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x + p.shakeX - p.size / 2, p.y + p.shakeY - p.size / 2, p.size, p.size);
    ctx.restore();
  },
};
