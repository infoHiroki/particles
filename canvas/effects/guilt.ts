/**
 * Guilt エフェクト
 * ギルト + 罪悪感 + 重圧
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#2f2f2f', '#3f3f3f', '#4f4f4f'];
interface GuiltParticle extends Particle { type: 'weight'; size: number; vy: number; rotation: number; color: string; }
export const guiltEffect: Effect = {
  config: { name: 'guilt', description: 'ギルト + 罪悪感', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GuiltParticle[] = [];
    const count = Math.floor(12 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'weight', x: x + random(-50, 50), y: y - 50 - random(0, 30), progress: 0, maxProgress: 55, delay: random(0, 15), alpha: 0, size: random(8, 15), vy: 0, rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GuiltParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.vy += 0.15;
    p.y += p.vy;
    p.rotation += 0.02;
    p.alpha = Math.sin(t * Math.PI) * 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GuiltParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  },
};
