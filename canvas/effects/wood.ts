/**
 * Wood エフェクト
 * ウッド + 木目 + 自然
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#8b4513', '#a0522d', '#cd853f'];
interface WoodParticle extends Particle { type: 'chip'; size: number; rotation: number; vx: number; vy: number; color: string; }
export const woodEffect: Effect = {
  config: { name: 'wood', description: 'ウッド + 木目', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: WoodParticle[] = [];
    const count = Math.floor(18 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(-Math.PI, 0);
      const speed = random(1, 4);
      particles.push({ id: generateId(), type: 'chip', x, y, progress: 0, maxProgress: 45, delay: random(0, 5), alpha: 0, size: random(3, 8), rotation: random(0, Math.PI), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WoodParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.rotation += 0.08;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WoodParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  },
};
