/**
 * Fade2 エフェクト
 * フェード + 透明 + 出現
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#aaaaaa', '#666666'];
interface Fade2Particle extends Particle { type: 'overlay' | 'particle'; size: number; vx: number; vy: number; color: string; }
export const fade2Effect: Effect = {
  config: { name: 'fade2', description: 'フェード + 透明', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Fade2Particle[] = [];
    particles.push({ id: generateId(), type: 'overlay', x, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: 60, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    const particleCount = Math.floor(15 * intensity);
    for (let i = 0; i < particleCount; i++) {
      particles.push({ id: generateId(), type: 'particle', x: x + random(-40, 40), y: y + random(-40, 40), progress: 0, maxProgress: 60, delay: random(10, 30), alpha: 0, size: random(3, 8), vx: random(-0.5, 0.5), vy: random(-0.5, 0.5), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Fade2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'particle') {
      p.x += p.vx;
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI) * (p.type === 'overlay' ? 0.3 : 0.7);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Fade2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'overlay') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
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
