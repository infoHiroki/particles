/**
 * Static エフェクト
 * スタティック + 静電気 + ザラザラ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#dddddd', '#bbbbbb'];
interface StaticParticle extends Particle { type: 'dot'; size: number; flicker: number; color: string; }
export const staticEffect: Effect = {
  config: { name: 'static', description: 'スタティック + 静電気', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: StaticParticle[] = [];
    const count = Math.floor(50 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'dot', x: x + random(-50, 50), y: y + random(-50, 50), progress: 0, maxProgress: 35, delay: random(0, 15), alpha: 0, size: random(1, 3), flicker: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StaticParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.flicker = random(0, 1);
    p.x += random(-2, 2);
    p.y += random(-2, 2);
    p.alpha = Math.sin(t * Math.PI) * p.flicker;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StaticParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    ctx.restore();
  },
};
