/**
 * Chi エフェクト
 * 気 + 氣 + 内力
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ffaa', '#66dd88', '#44bb66'];
interface ChiParticle extends Particle { type: 'flow'; size: number; angle: number; dist: number; rotSpeed: number; color: string; }
export const chiEffect: Effect = {
  config: { name: 'chi', description: '気 + 氣', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ChiParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'flow', x, y, progress: 0, maxProgress: 60, delay: i * 2, alpha: 0, size: random(4, 8), angle, dist: random(15, 30), rotSpeed: random(0.05, 0.1), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ChiParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.rotSpeed;
    p.dist += 0.3;
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ChiParticle;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * p.dist;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
