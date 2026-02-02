/**
 * Gather エフェクト
 * ギャザー + 集合 + 収束
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#5599ff', '#66aaff'];
interface GatherParticle extends Particle { type: 'piece'; size: number; startX: number; startY: number; color: string; }
export const gatherEffect: Effect = {
  config: { name: 'gather', description: 'ギャザー + 集合', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GatherParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(40, 80);
      particles.push({ id: generateId(), type: 'piece', x, y, progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, size: random(3, 6), startX: x + Math.cos(angle) * dist, startY: y + Math.sin(angle) * dist, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GatherParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const ease = t * t;
    const currentX = p.startX + (p.x - p.startX) * ease;
    const currentY = p.startY + (p.y - p.startY) * ease;
    p.alpha = Math.sin(t * Math.PI);
    (p as any).drawX = currentX;
    (p as any).drawY = currentY;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GatherParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc((p as any).drawX ?? p.startX, (p as any).drawY ?? p.startY, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
