/**
 * Neon エフェクト
 * ネオン + 蛍光 + 看板
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff00ff', '#00ffff', '#ffff00'];
interface NeonParticle extends Particle { type: 'tube'; size: number; length: number; flicker: number; color: string; }
export const neonEffect: Effect = {
  config: { name: 'neon', description: 'ネオン + 蛍光', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: NeonParticle[] = [];
    const count = Math.floor(4 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'tube', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 70, delay: i * 8, alpha: 0, size: random(3, 5), length: random(30, 50), flicker: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as NeonParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.flicker = Math.random() > 0.9 ? 0.3 : 1;
    p.alpha = Math.sin(t * Math.PI) * p.flicker;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as NeonParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(p.x - p.length / 2, p.y);
    ctx.lineTo(p.x + p.length / 2, p.y);
    ctx.stroke();
    ctx.restore();
  },
};
