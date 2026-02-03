/**
 * Pride エフェクト
 * プライド + 誇り + 威厳
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffd700', '#daa520', '#b8860b'];
interface PrideParticle extends Particle { type: 'crown'; size: number; vy: number; glow: number; color: string; }
export const prideEffect: Effect = {
  config: { name: 'pride', description: 'プライド + 誇り', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PrideParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'crown', x: x + random(-40, 40), y, progress: 0, maxProgress: 55, delay: random(0, 10), alpha: 0, size: random(6, 12), vy: random(-1.5, -0.5), glow: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PrideParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.glow = Math.sin(t * Math.PI * 3) * 0.5 + 0.5;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PrideParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.x - p.size, p.y + p.size * 0.5);
    ctx.lineTo(p.x - p.size * 0.5, p.y - p.size * 0.3);
    ctx.lineTo(p.x, p.y - p.size);
    ctx.lineTo(p.x + p.size * 0.5, p.y - p.size * 0.3);
    ctx.lineTo(p.x + p.size, p.y + p.size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${p.glow * 0.5})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y - p.size * 0.5, p.size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
