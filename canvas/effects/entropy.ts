/**
 * Entropy エフェクト
 * エントロピー + 無秩序化 + 拡散
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff8800', '#ffaa44', '#ffcc88'];
interface EntropyParticle extends Particle { type: 'particle'; size: number; vx: number; vy: number; decay: number; color: string; }
export const entropyEffect: Effect = {
  config: { name: 'entropy', description: 'エントロピー + 無秩序化', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: EntropyParticle[] = [];
    const count = Math.floor(50 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'particle', x, y, progress: 0, maxProgress: 70, delay: random(0, 15), alpha: 0, size: random(2, 5), vx: 0, vy: 0, decay: random(0.02, 0.05), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as EntropyParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.vx += random(-0.3, 0.3);
    p.vy += random(-0.3, 0.3);
    p.x += p.vx;
    p.y += p.vy;
    p.size *= (1 - p.decay);
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as EntropyParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
