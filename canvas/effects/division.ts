/**
 * Division エフェクト
 * ディビジョン + 分裂 + 分離
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6644', '#44ff66', '#4466ff'];
interface DivisionParticle extends Particle { type: 'half'; size: number; vx: number; vy: number; side: number; color: string; }
export const divisionEffect: Effect = {
  config: { name: 'division', description: 'ディビジョン + 分裂', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DivisionParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const angle = random(-Math.PI * 0.3, Math.PI * 0.3) + (side > 0 ? 0 : Math.PI);
      const speed = random(2, 5);
      particles.push({ id: generateId(), type: 'half', x, y, progress: 0, maxProgress: 45, delay: random(0, 8), alpha: 0, size: random(4, 8), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed + random(-1, 1), side, color: side > 0 ? DEFAULT_COLORS[0] : DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DivisionParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DivisionParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    if (p.side > 0) {
      ctx.arc(p.x, p.y, p.size, -Math.PI / 2, Math.PI / 2);
    } else {
      ctx.arc(p.x, p.y, p.size, Math.PI / 2, -Math.PI / 2);
    }
    ctx.fill();
    ctx.restore();
  },
};
