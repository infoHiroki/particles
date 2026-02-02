/**
 * Thread エフェクト
 * 糸 + スレッド + 繊維
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#eeeeee', '#dddddd'];
interface ThreadParticle extends Particle { type: 'fiber'; size: number; points: {x: number, y: number}[]; wobble: number; color: string; }
export const threadEffect: Effect = {
  config: { name: 'thread', description: '糸 + スレッド', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ThreadParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      const points: {x: number, y: number}[] = [];
      let px = x + random(-30, 30);
      let py = y - 30;
      for (let j = 0; j < 8; j++) {
        points.push({x: px, y: py});
        px += random(-10, 10);
        py += 10;
      }
      particles.push({ id: generateId(), type: 'fiber', x, y, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 1, points, wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ThreadParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.wobble += 0.1;
    for (let i = 0; i < p.points.length; i++) {
      p.points[i].x += Math.sin(p.wobble + i * 0.5) * 0.3;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ThreadParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.beginPath();
    ctx.moveTo(p.points[0].x, p.points[0].y);
    for (let i = 1; i < p.points.length; i++) {
      ctx.lineTo(p.points[i].x, p.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  },
};
