/**
 * Sweat エフェクト
 * 汗 + 緊張 + 焦り
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ccff', '#aaddff', '#66bbff'];
interface SweatParticle extends Particle { type: 'drop'; size: number; vy: number; gravity: number; color: string; }
export const sweatEffect: Effect = {
  config: { name: 'sweat', description: '汗 + 緊張', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SweatParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'drop', x: x + random(-15, 15), y: y - 10, progress: 0, maxProgress: 50, delay: i * 10, alpha: 0, size: random(4, 8), vy: 0, gravity: 0.1, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SweatParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.vy += p.gravity;
    p.y += p.vy;
    p.alpha = 1 - t * 0.5;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SweatParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - p.size);
    ctx.quadraticCurveTo(p.x + p.size, p.y, p.x, p.y + p.size);
    ctx.quadraticCurveTo(p.x - p.size, p.y, p.x, p.y - p.size);
    ctx.fill();
    ctx.restore();
  },
};
