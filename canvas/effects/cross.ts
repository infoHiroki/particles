/**
 * Cross エフェクト
 * 十字 + 回転 + 神聖
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffdd88', '#ffffff', '#88ddff'];
interface CrossParticle extends Particle { type: 'cross' | 'glow'; size: number; rotation: number; spin: number; color: string; }
export const crossEffect: Effect = {
  config: { name: 'cross', description: '十字 + 神聖', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CrossParticle[] = [];
    particles.push({ id: generateId(), type: 'glow', x, y, progress: 0, maxProgress: 55, alpha: 0, size: 50, rotation: 0, spin: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'cross', x, y, progress: 0, maxProgress: 50, delay: 3, alpha: 0, size: 25, rotation: 0, spin: 0.02, color: DEFAULT_COLORS[1] });
    const count = Math.floor(4 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'cross', x: x + random(-35, 35), y: y + random(-35, 35), progress: 0, maxProgress: 45, delay: random(8, 20), alpha: 0, size: random(8, 15), rotation: random(0, Math.PI / 4), spin: random(-0.05, 0.05), color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CrossParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.rotation += p.spin;
    p.alpha = t < 0.15 ? t / 0.15 : (1 - t) * (p.type === 'glow' ? 0.5 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CrossParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.type === 'glow') {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      g.addColorStop(0, p.color + '66');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      const w = p.size * 0.25;
      ctx.fillRect(-w / 2, -p.size, w, p.size * 2);
      ctx.fillRect(-p.size * 0.7, -w / 2, p.size * 1.4, w);
    }
    ctx.restore();
  },
};
