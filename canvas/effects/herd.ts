/**
 * Herd エフェクト
 * 群れ + 集団 + ハード
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#996644', '#aa7755', '#bb8866'];
interface HerdParticle extends Particle { type: 'animal'; size: number; vx: number; legPhase: number; color: string; }
export const herdEffect: Effect = {
  config: { name: 'herd', description: '群れ + 集団', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HerdParticle[] = [];
    const count = Math.floor(10 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'animal', x: x + random(-60, 60), y: y + random(-20, 20), progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, size: random(8, 14), vx: random(1, 2), legPhase: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HerdParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.legPhase += 0.3;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HerdParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 3, p.size, p.size * 0.5);
    const legOffset = Math.sin(p.legPhase) * 3;
    ctx.fillRect(p.x - p.size / 3, p.y + p.size / 6, 3, p.size / 3 + legOffset);
    ctx.fillRect(p.x + p.size / 3 - 3, p.y + p.size / 6, 3, p.size / 3 - legOffset);
    ctx.restore();
  },
};
