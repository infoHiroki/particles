/**
 * Bolt2 エフェクト
 * 稲妻 + 電撃 + ボルト
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffff00', '#ffff88', '#ffffff'];
interface Bolt2Particle extends Particle { type: 'bolt'; size: number; segments: {x: number, y: number}[]; color: string; }
export const bolt2Effect: Effect = {
  config: { name: 'bolt2', description: '稲妻 + 電撃', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Bolt2Particle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      const segments: {x: number, y: number}[] = [];
      let cx = x + random(-20, 20);
      let cy = y - 40;
      segments.push({x: cx, y: cy});
      for (let j = 0; j < 5; j++) {
        cx += random(-15, 15);
        cy += 15;
        segments.push({x: cx, y: cy});
      }
      particles.push({ id: generateId(), type: 'bolt', x, y, progress: 0, maxProgress: 25, delay: i * 8, alpha: 0, size: random(2, 4), segments, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Bolt2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = t < 0.3 ? 1 : (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Bolt2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(p.segments[0].x, p.segments[0].y);
    for (let i = 1; i < p.segments.length; i++) {
      ctx.lineTo(p.segments[i].x, p.segments[i].y);
    }
    ctx.stroke();
    ctx.restore();
  },
};
