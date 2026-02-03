/**
 * Path エフェクト
 * パス + 経路 + 道筋
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44ff88', '#66ffaa', '#88ffcc'];
interface PathParticle extends Particle { type: 'line'; size: number; points: {x: number, y: number}[]; drawProgress: number; color: string; }
export const pathEffect: Effect = {
  config: { name: 'path', description: 'パス + 経路', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PathParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      const points: {x: number, y: number}[] = [];
      let px = x - 40;
      let py = y + random(-20, 20);
      for (let j = 0; j < 6; j++) {
        points.push({x: px, y: py});
        px += 16;
        py += random(-15, 15);
      }
      particles.push({ id: generateId(), type: 'line', x, y, progress: 0, maxProgress: 45, delay: i * 10, alpha: 0, size: random(2, 3), points, drawProgress: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PathParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.drawProgress = Math.min(1, t * 2);
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PathParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const numPoints = Math.floor(p.points.length * p.drawProgress);
    if (numPoints > 0) {
      ctx.beginPath();
      ctx.moveTo(p.points[0].x, p.points[0].y);
      for (let i = 1; i < numPoints; i++) {
        ctx.lineTo(p.points[i].x, p.points[i].y);
      }
      ctx.stroke();
    }
    ctx.restore();
  },
};
