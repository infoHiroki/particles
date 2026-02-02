/**
 * Ribbon エフェクト
 * リボン + 流れ + 優雅
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff88aa', '#ff66aa', '#ff44aa'];

interface RibbonParticle extends Particle {
  type: 'ribbon';
  size: number;
  points: { x: number; y: number }[];
  phase: number;
  color: string;
}

export const ribbonEffect: Effect = {
  config: { name: 'ribbon', description: 'リボン + 流れ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RibbonParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      const points: { x: number; y: number }[] = [];
      for (let j = 0; j < 20; j++) {
        points.push({ x: x - 50 + j * 5 + random(-5, 5), y: y + random(-20, 20) });
      }
      particles.push({
        id: generateId(), type: 'ribbon', x, y, progress: 0, maxProgress: 80,
        delay: i * 10, alpha: 0, size: random(3, 6), points, phase: random(0, Math.PI * 2),
        color: DEFAULT_COLORS[i % 3],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RibbonParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.1;
    for (let i = 0; i < p.points.length; i++) {
      p.points[i].y += Math.sin(p.phase + i * 0.3) * 1.5;
      p.points[i].x += 1;
    }
    p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8 * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RibbonParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(p.points[0].x, p.points[0].y);
    for (let i = 1; i < p.points.length; i++) ctx.lineTo(p.points[i].x, p.points[i].y);
    ctx.stroke();
    ctx.restore();
  },
};
