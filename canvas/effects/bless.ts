/**
 * Bless エフェクト
 * 祝福 + 加護 + ブレス
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffff88', '#ffffaa', '#ffffcc'];
interface BlessParticle extends Particle { type: 'glow' | 'sparkle'; size: number; vy: number; wobble: number; color: string; }
export const blessEffect: Effect = {
  config: { name: 'bless', description: '祝福 + 加護', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BlessParticle[] = [];
    particles.push({ id: generateId(), type: 'glow', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 35, vy: 0, wobble: 0, color: DEFAULT_COLORS[0] });
    const sparkleCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-40, 40), y: y + random(20, 40), progress: 0, maxProgress: 50, delay: random(0, 20), alpha: 0, size: random(2, 5), vy: random(-1.5, -0.5), wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BlessParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'sparkle') {
      p.wobble += 0.1;
      p.x += Math.sin(p.wobble) * 0.3;
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BlessParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'glow') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, p.color);
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
