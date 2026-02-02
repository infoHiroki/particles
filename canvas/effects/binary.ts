/**
 * Binary エフェクト
 * バイナリ + 二進数 + デジタル
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ff00', '#00cc00', '#009900'];
interface BinaryParticle extends Particle { type: 'digit'; size: number; value: string; vy: number; color: string; }
export const binaryEffect: Effect = {
  config: { name: 'binary', description: 'バイナリ + 二進数', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BinaryParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'digit', x: x + random(-50, 50), y: y + random(-30, 30), progress: 0, maxProgress: 50, delay: random(0, 20), alpha: 0, size: random(10, 14), value: Math.random() > 0.5 ? '1' : '0', vy: random(0.5, 1.5), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BinaryParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    if (Math.random() > 0.95) p.value = Math.random() > 0.5 ? '1' : '0';
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BinaryParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.font = `${p.size}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(p.value, p.x, p.y);
    ctx.restore();
  },
};
