/**
 * Order エフェクト
 * オーダー + 秩序 + 整列
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#88ccff'];
interface OrderParticle extends Particle { type: 'dot'; targetX: number; targetY: number; startX: number; startY: number; color: string; }
export const orderEffect: Effect = {
  config: { name: 'order', description: 'オーダー + 秩序', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: OrderParticle[] = [];
    const gridSize = Math.floor(5 * intensity);
    const spacing = 15;
    for (let gx = -gridSize; gx <= gridSize; gx++) {
      for (let gy = -gridSize; gy <= gridSize; gy++) {
        const angle = random(0, Math.PI * 2);
        const dist = random(50, 100);
        particles.push({ id: generateId(), type: 'dot', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, targetX: x + gx * spacing, targetY: y + gy * spacing, startX: x + Math.cos(angle) * dist, startY: y + Math.sin(angle) * dist, color: DEFAULT_COLORS[(gx + gy) % 3 + 3 > 2 ? (gx + gy) % 3 : 0] });
      }
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as OrderParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    p.x = p.startX + (p.targetX - p.startX) * ease;
    p.y = p.startY + (p.targetY - p.startY) * ease;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as OrderParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
