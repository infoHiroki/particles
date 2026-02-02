/**
 * Spirit エフェクト
 * スピリット + 精霊 + 霊
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aaffee', '#88ddcc', '#66bbaa'];
interface SpiritParticle extends Particle { type: 'wisp'; size: number; vx: number; vy: number; wobble: number; color: string; }
export const spiritEffect: Effect = {
  config: { name: 'spirit', description: 'スピリット + 精霊', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SpiritParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'wisp', x: x + random(-20, 20), y: y + random(-20, 20), progress: 0, maxProgress: 70, delay: i * 5, alpha: 0, size: random(8, 15), vx: random(-0.5, 0.5), vy: random(-1, -0.5), wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SpiritParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.wobble += 0.08;
    p.x += p.vx + Math.sin(p.wobble) * 0.8;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI) * 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SpiritParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, p.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
