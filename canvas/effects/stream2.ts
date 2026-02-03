/**
 * Stream2 エフェクト
 * ストリーム2 + 小川 + 連続
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#88ccff'];
interface Stream2Particle extends Particle { type: 'water'; size: number; vx: number; vy: number; trail: {x: number; y: number}[]; color: string; }
export const stream2Effect: Effect = {
  config: { name: 'stream2', description: 'ストリーム2 + 小川', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Stream2Particle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'water', x: x - 50, y: y + random(-10, 10), progress: 0, maxProgress: 50, delay: i * 3, alpha: 0, size: random(4, 7), vx: random(3, 5), vy: random(-0.5, 0.5), trail: [], color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Stream2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.trail.push({x: p.x, y: p.y});
    if (p.trail.length > 8) p.trail.shift();
    p.x += p.vx;
    p.y += p.vy + Math.sin(p.progress * 0.2) * 0.3;
    p.alpha = Math.sin(t * Math.PI) * 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Stream2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha * 0.5;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size * 0.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < p.trail.length; i++) {
      if (i === 0) ctx.moveTo(p.trail[i].x, p.trail[i].y);
      else ctx.lineTo(p.trail[i].x, p.trail[i].y);
    }
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
