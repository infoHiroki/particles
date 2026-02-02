/**
 * Fall エフェクト
 * フォール + 落下 + 降下
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#888888', '#666666', '#444444'];
interface FallParticle extends Particle { type: 'debris'; size: number; vx: number; vy: number; rotation: number; rotSpeed: number; color: string; }
export const fallEffect: Effect = {
  config: { name: 'fall', description: 'フォール + 落下', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FallParticle[] = [];
    const count = Math.floor(12 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'debris', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, size: random(4, 10), vx: random(-1, 1), vy: random(1, 2), rotation: random(0, Math.PI * 2), rotSpeed: random(-0.2, 0.2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FallParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.rotation += p.rotSpeed;
    p.alpha = 1 - t;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FallParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  },
};
