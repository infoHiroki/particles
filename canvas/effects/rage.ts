/**
 * Rage エフェクト
 * 怒り + 激昂 + プンプン
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0000', '#ff3333', '#cc0000'];
interface RageParticle extends Particle { type: 'vein' | 'steam'; size: number; vx: number; vy: number; color: string; }
export const rageEffect: Effect = {
  config: { name: 'rage', description: '怒り + 激昂', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RageParticle[] = [];
    particles.push({ id: generateId(), type: 'vein', x: x - 15, y: y - 15, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 12, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'vein', x: x + 15, y: y - 10, progress: 0, maxProgress: 60, delay: 5, alpha: 0, size: 10, vx: 0, vy: 0, color: DEFAULT_COLORS[1] });
    const steamCount = Math.floor(6 * intensity);
    for (let i = 0; i < steamCount; i++) {
      particles.push({ id: generateId(), type: 'steam', x: x + random(-10, 10), y: y - 20, progress: 0, maxProgress: 40, delay: i * 5, alpha: 0, size: random(5, 10), vx: random(-0.5, 0.5), vy: random(-1.5, -2.5), color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RageParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'steam') {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = (1 - t) * 0.6;
    } else {
      p.alpha = Math.sin(t * Math.PI);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RageParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'vein') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.size, p.y);
      ctx.lineTo(p.x + p.size, p.y + p.size);
      ctx.moveTo(p.x + p.size * 0.5, p.y);
      ctx.lineTo(p.x + p.size * 0.5, p.y + p.size * 0.7);
      ctx.stroke();
    } else {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
