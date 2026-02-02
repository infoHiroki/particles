/**
 * Mana エフェクト
 * マナ + 魔力 + 霊力
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#88ccff'];
interface ManaParticle extends Particle { type: 'orb' | 'sparkle'; size: number; vy: number; wobble: number; color: string; }
export const manaEffect: Effect = {
  config: { name: 'mana', description: 'マナ + 魔力', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ManaParticle[] = [];
    particles.push({ id: generateId(), type: 'orb', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 25, vy: 0, wobble: 0, color: DEFAULT_COLORS[0] });
    const sparkleCount = Math.floor(12 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-30, 30), y: y + random(-30, 30), progress: 0, maxProgress: 50, delay: random(5, 25), alpha: 0, size: random(2, 4), vy: random(-0.5, -0.2), wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ManaParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'sparkle') {
      p.wobble += 0.1;
      p.x += Math.sin(p.wobble) * 0.5;
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ManaParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'orb') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
