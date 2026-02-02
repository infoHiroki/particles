/**
 * Factory エフェクト
 * 工場 + 煙 + 産業
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#555555', '#666666', '#777777'];
interface FactoryParticle extends Particle { type: 'chimney' | 'smoke'; size: number; vx: number; vy: number; color: string; }
export const factoryEffect: Effect = {
  config: { name: 'factory', description: '工場 + 煙', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FactoryParticle[] = [];
    particles.push({ id: generateId(), type: 'chimney', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 15, vx: 0, vy: 0, color: '#444444' });
    const smokeCount = Math.floor(20 * intensity);
    for (let i = 0; i < smokeCount; i++) {
      particles.push({ id: generateId(), type: 'smoke', x: x + random(-5, 5), y: y - 20, progress: 0, maxProgress: 60, delay: i * 3, alpha: 0, size: random(8, 15), vx: random(-0.3, 0.5), vy: random(-1, -2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FactoryParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'smoke') {
      p.x += p.vx;
      p.y += p.vy;
      p.size += 0.2;
      p.alpha = (1 - t) * 0.4;
    } else {
      p.alpha = Math.sin(t * Math.PI);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FactoryParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'chimney') {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size * 0.4, p.y - p.size, p.size * 0.8, p.size * 2);
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
