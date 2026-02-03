/**
 * Droplet エフェクト
 * ドロップレット + 水滴 + 雫
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ccff', '#aaddff', '#cceeFF'];
interface DropletParticle extends Particle { type: 'drop'; size: number; vy: number; wobble: number; color: string; }
export const dropletEffect: Effect = {
  config: { name: 'droplet', description: 'ドロップレット + 水滴', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DropletParticle[] = [];
    const count = Math.floor(12 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'drop', x: x + random(-30, 30), y: y - 30 - random(0, 20), progress: 0, maxProgress: 45, delay: random(0, 15), alpha: 0, size: random(4, 8), vy: 0, wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DropletParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.vy += 0.2;
    p.y += p.vy;
    p.wobble += 0.1;
    p.x += Math.sin(p.wobble) * 0.3;
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DropletParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - p.size);
    ctx.quadraticCurveTo(p.x + p.size, p.y + p.size * 0.5, p.x, p.y + p.size);
    ctx.quadraticCurveTo(p.x - p.size, p.y + p.size * 0.5, p.x, p.y - p.size);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.2, p.size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
