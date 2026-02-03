/**
 * Shame エフェクト
 * シェイム + 恥 + 赤面
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6b6b', '#ee5a5a', '#dd4949'];
interface ShameParticle extends Particle { type: 'blush'; size: number; offsetX: number; offsetY: number; pulse: number; color: string; }
export const shameEffect: Effect = {
  config: { name: 'shame', description: 'シェイム + 恥', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ShameParticle[] = [];
    particles.push({ id: generateId(), type: 'blush', x: x - 25, y: y + 10, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 20, offsetX: -25, offsetY: 10, pulse: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'blush', x: x + 25, y: y + 10, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 20, offsetX: 25, offsetY: 10, pulse: Math.PI, color: DEFAULT_COLORS[0] });
    const dropCount = Math.floor(5 * intensity);
    for (let i = 0; i < dropCount; i++) {
      particles.push({ id: generateId(), type: 'blush', x: x + random(-15, 15), y: y - 20, progress: 0, maxProgress: 45, delay: random(10, 25), alpha: 0, size: random(3, 6), offsetX: 0, offsetY: 0, pulse: 0, color: '#4488cc' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ShameParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.pulse += 0.1;
    if (p.size > 10) {
      p.alpha = Math.sin(t * Math.PI) * (0.5 + Math.sin(p.pulse) * 0.2);
    } else {
      p.y += 1.5;
      p.alpha = Math.sin(t * Math.PI) * 0.7;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ShameParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.size > 10) {
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
