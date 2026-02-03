/**
 * Chaos2 エフェクト
 * カオス2 + 混沌 + 無秩序
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0000', '#00ff00', '#0000ff'];
interface Chaos2Particle extends Particle { type: 'fragment'; size: number; vx: number; vy: number; ax: number; ay: number; color: string; }
export const chaos2Effect: Effect = {
  config: { name: 'chaos2', description: 'カオス2 + 混沌', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Chaos2Particle[] = [];
    const count = Math.floor(40 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(2, 6);
      particles.push({ id: generateId(), type: 'fragment', x, y, progress: 0, maxProgress: 50, delay: random(0, 5), alpha: 0, size: random(2, 6), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, ax: random(-0.3, 0.3), ay: random(-0.3, 0.3), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Chaos2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.vx += p.ax + random(-0.5, 0.5);
    p.vy += p.ay + random(-0.5, 0.5);
    p.x += p.vx;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Chaos2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    ctx.restore();
  },
};
