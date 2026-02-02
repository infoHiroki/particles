/**
 * Cyclone エフェクト
 * サイクロン + 竜巻 + 渦巻き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88aa99', '#779988', '#668877'];
interface CycloneParticle extends Particle { type: 'spiral'; size: number; angle: number; dist: number; height: number; rotSpeed: number; color: string; }
export const cycloneEffect: Effect = {
  config: { name: 'cyclone', description: 'サイクロン + 竜巻', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CycloneParticle[] = [];
    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'spiral', x, y, progress: 0, maxProgress: 70, delay: i * 2, alpha: 0, size: random(2, 4), angle, dist: random(5, 15), height: 0, rotSpeed: 0.15, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CycloneParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.rotSpeed;
    p.height -= 1.5;
    p.dist += 0.3;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CycloneParticle;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + p.height + Math.sin(p.angle) * p.dist * 0.3;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
