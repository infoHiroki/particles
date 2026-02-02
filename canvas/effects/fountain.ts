/**
 * Fountain エフェクト
 * 噴水 + 上昇 + 落下
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#66aaff', '#88ccff', '#aaeeff'];
interface FountainParticle extends Particle { type: 'drop'; size: number; vx: number; vy: number; gravity: number; color: string; }
export const fountainEffect: Effect = {
  config: { name: 'fountain', description: '噴水 + 上昇', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FountainParticle[] = [];
    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(-0.5, 0.5) - Math.PI / 2;
      const speed = random(4, 7);
      particles.push({ id: generateId(), type: 'drop', x, y, progress: 0, maxProgress: 70, delay: i * 2, alpha: 0, size: random(3, 6), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, gravity: 0.12, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FountainParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.alpha = 1 - t * 0.5;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FountainParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
