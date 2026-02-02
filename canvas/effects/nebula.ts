/**
 * Nebula エフェクト
 * 星雲 + 漂い + ガス
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff66aa', '#66aaff', '#aa66ff'];
interface NebulaParticle extends Particle { type: 'cloud'; size: number; vx: number; vy: number; color: string; }
export const nebulaEffect: Effect = {
  config: { name: 'nebula', description: '星雲 + 漂い', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: NebulaParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'cloud', x: x + random(-30, 30), y: y + random(-30, 30), progress: 0, maxProgress: 100, delay: random(0, 20), alpha: 0, size: random(20, 50), vx: random(-0.3, 0.3), vy: random(-0.3, 0.3), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as NebulaParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI) * 0.4;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as NebulaParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grad.addColorStop(0, p.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
