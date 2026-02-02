/**
 * Tide エフェクト
 * 潮 + 波 + 寄せ引き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488cc', '#66aadd', '#88ccee'];
interface TideParticle extends Particle { type: 'wave'; size: number; startX: number; phase: number; amp: number; color: string; }
export const tideEffect: Effect = {
  config: { name: 'tide', description: '潮 + 波', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TideParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const startX = x - 60 + (i / count) * 120;
      particles.push({ id: generateId(), type: 'wave', x: startX, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: random(4, 8), startX, phase: (i / count) * Math.PI * 2, amp: random(10, 20), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TideParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.1;
    p.x = p.startX + Math.sin(p.phase) * 15;
    p.y = p.y + Math.cos(p.phase) * 0.5;
    p.alpha = Math.sin(t * Math.PI) * 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TideParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
