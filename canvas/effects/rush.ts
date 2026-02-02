/**
 * Rush エフェクト
 * ラッシュ + 突進 + 連撃
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa00', '#ffcc44', '#ffee88'];
interface RushParticle extends Particle { type: 'streak'; size: number; vx: number; length: number; color: string; }
export const rushEffect: Effect = {
  config: { name: 'rush', description: 'ラッシュ + 突進', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RushParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'streak', x: x - 50, y: y + random(-20, 20), progress: 0, maxProgress: 25, delay: i * 3, alpha: 0, size: random(2, 4), vx: random(8, 12), length: random(20, 40), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RushParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RushParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.beginPath();
    ctx.moveTo(p.x - p.length, p.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.restore();
  },
};
