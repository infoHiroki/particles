/**
 * Temporal エフェクト
 * テンポラル + 時間 + 時の流れ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffd700', '#daa520', '#b8860b'];
interface TemporalParticle extends Particle { type: 'clock'; size: number; angle: number; speed: number; trail: {x: number; y: number; a: number}[]; color: string; }
export const temporalEffect: Effect = {
  config: { name: 'temporal', description: 'テンポラル + 時間', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TemporalParticle[] = [];
    const count = Math.floor(12 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'clock', x, y, progress: 0, maxProgress: 60, delay: i * 3, alpha: 0, size: random(3, 6), angle: (i / count) * Math.PI * 2, speed: random(0.08, 0.15), trail: [], color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TemporalParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const dist = 40;
    const px = p.x + Math.cos(p.angle) * dist;
    const py = p.y + Math.sin(p.angle) * dist;
    p.trail.push({x: px, y: py, a: p.alpha});
    if (p.trail.length > 10) p.trail.shift();
    p.angle += p.speed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TemporalParticle;
    ctx.save();
    for (let i = 0; i < p.trail.length; i++) {
      ctx.globalAlpha = (i / p.trail.length) * p.alpha * 0.3;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.trail[i].x, p.trail[i].y, p.size * (i / p.trail.length), 0, Math.PI * 2);
      ctx.fill();
    }
    const dist = 40;
    const px = p.x + Math.cos(p.angle) * dist;
    const py = p.y + Math.sin(p.angle) * dist;
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
