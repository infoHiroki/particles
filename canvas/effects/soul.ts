/**
 * Soul エフェクト
 * ソウル + 魂 + 霊魂
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#eeeeff', '#ddddff'];
interface SoulParticle extends Particle { type: 'core' | 'trail'; size: number; vy: number; trailX: number; trailY: number; color: string; }
export const soulEffect: Effect = {
  config: { name: 'soul', description: 'ソウル + 魂', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SoulParticle[] = [];
    particles.push({ id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 15, vy: -1, trailX: 0, trailY: 0, color: DEFAULT_COLORS[0] });
    const trailCount = Math.floor(8 * intensity);
    for (let i = 0; i < trailCount; i++) {
      particles.push({ id: generateId(), type: 'trail', x, y, progress: 0, maxProgress: 70, delay: (i + 1) * 4, alpha: 0, size: 10 - i * 0.8, vy: -1, trailX: 0, trailY: i * 8, color: DEFAULT_COLORS[(i + 1) % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SoulParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI) * (p.type === 'core' ? 1 : 0.5);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SoulParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const grad = ctx.createRadialGradient(p.x, p.y + p.trailY, 0, p.x, p.y + p.trailY, p.size);
    grad.addColorStop(0, p.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y + p.trailY, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
