/**
 * Meteor2 エフェクト
 * メテオ2 + 流星雨 + 落下
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa00', '#ff8800', '#ff6600'];
interface Meteor2Particle extends Particle { type: 'rock'; size: number; vx: number; vy: number; trail: {x: number; y: number}[]; color: string; }
export const meteor2Effect: Effect = {
  config: { name: 'meteor2', description: 'メテオ2 + 流星雨', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Meteor2Particle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      const startX = x + random(-80, 80);
      const startY = y - 60 - random(0, 40);
      particles.push({ id: generateId(), type: 'rock', x: startX, y: startY, progress: 0, maxProgress: 35, delay: random(0, 15), alpha: 0, size: random(3, 6), vx: random(2, 4), vy: random(4, 7), trail: [], color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Meteor2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.trail.push({x: p.x, y: p.y});
    if (p.trail.length > 8) p.trail.shift();
    p.x += p.vx;
    p.y += p.vy;
    p.alpha = (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Meteor2Particle;
    ctx.save();
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.lineCap = 'round';
    ctx.globalAlpha = p.alpha * 0.6;
    ctx.beginPath();
    if (p.trail.length > 0) {
      ctx.moveTo(p.trail[0].x, p.trail[0].y);
      for (const pt of p.trail) ctx.lineTo(pt.x, pt.y);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
