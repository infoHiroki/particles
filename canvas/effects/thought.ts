/**
 * Thought エフェクト
 * 思考 + 雲 + 考え
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#eeeeee', '#dddddd'];
interface ThoughtParticle extends Particle { type: 'cloud' | 'trail'; size: number; offsetX: number; offsetY: number; color: string; }
export const thoughtEffect: Effect = {
  config: { name: 'thought', description: '思考 + 雲', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ThoughtParticle[] = [];
    const cloudOffsets = [{ x: 0, y: 0, s: 25 }, { x: -20, y: 5, s: 18 }, { x: 20, y: 8, s: 20 }, { x: -10, y: -12, s: 15 }, { x: 15, y: -10, s: 16 }];
    for (let i = 0; i < cloudOffsets.length; i++) {
      const o = cloudOffsets[i];
      particles.push({ id: generateId(), type: 'cloud', x: x + o.x, y: y + o.y, progress: 0, maxProgress: 60, delay: i * 3, alpha: 0, size: o.s, offsetX: o.x, offsetY: o.y, color: DEFAULT_COLORS[0] });
    }
    const trailCount = Math.floor(3 * intensity);
    for (let i = 0; i < trailCount; i++) {
      particles.push({ id: generateId(), type: 'trail', x: x - 25 - i * 8, y: y + 25 + i * 8, progress: 0, maxProgress: 60, delay: 15 + i * 5, alpha: 0, size: 8 - i * 2, offsetX: 0, offsetY: 0, color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ThoughtParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ThoughtParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.strokeStyle = '#aaaaaa';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  },
};
