/**
 * Serenity エフェクト
 * セレニティ + 平穏 + 静けさ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#99ddff', '#bbeeee', '#ddffff'];
interface SerenityParticle extends Particle { type: 'glow'; size: number; baseX: number; baseY: number; phase: number; color: string; }
export const serenityEffect: Effect = {
  config: { name: 'serenity', description: 'セレニティ + 平穏', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SerenityParticle[] = [];
    const count = Math.floor(12 * intensity);
    for (let i = 0; i < count; i++) {
      const px = x + random(-60, 60);
      const py = y + random(-40, 40);
      particles.push({ id: generateId(), type: 'glow', x: px, y: py, progress: 0, maxProgress: 90, delay: random(0, 20), alpha: 0, size: random(20, 40), baseX: px, baseY: py, phase: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SerenityParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.015;
    p.x = p.baseX + Math.sin(p.phase) * 8;
    p.y = p.baseY + Math.cos(p.phase * 0.6) * 5;
    p.alpha = Math.sin(t * Math.PI) * 0.25;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SerenityParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
