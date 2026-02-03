/**
 * Thrill エフェクト
 * スリル + 興奮 + ゾクゾク
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4400', '#ff8800', '#ffcc00'];
interface ThrillParticle extends Particle { type: 'bolt'; size: number; vx: number; vy: number; electric: number; color: string; }
export const thrillEffect: Effect = {
  config: { name: 'thrill', description: 'スリル + 興奮', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ThrillParticle[] = [];
    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(4, 8);
      particles.push({ id: generateId(), type: 'bolt', x, y, progress: 0, maxProgress: 35, delay: random(0, 5), alpha: 0, size: random(3, 7), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, electric: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ThrillParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx + random(-3, 3);
    p.y += p.vy + random(-3, 3);
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.electric = random(0.5, 1);
    p.alpha = (1 - t) * p.electric;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ThrillParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
