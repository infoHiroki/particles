/**
 * Overcast エフェクト
 * 曇り + どんより + 陰り
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#999999', '#888888', '#777777'];
interface OvercastParticle extends Particle { type: 'cloud'; size: number; vx: number; color: string; }
export const overcastEffect: Effect = {
  config: { name: 'overcast', description: '曇り + どんより', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: OvercastParticle[] = [];
    const count = Math.floor(6 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'cloud', x: x + random(-60, 60), y: y + random(-30, 30), progress: 0, maxProgress: 90, delay: random(0, 20), alpha: 0, size: random(40, 70), vx: random(-0.2, 0.2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as OvercastParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.alpha = Math.sin(t * Math.PI) * 0.4;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as OvercastParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
    ctx.arc(p.x - p.size * 0.3, p.y + 5, p.size * 0.4, 0, Math.PI * 2);
    ctx.arc(p.x + p.size * 0.3, p.y + 5, p.size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
