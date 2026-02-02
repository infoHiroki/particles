/**
 * Pool エフェクト
 * 水溜り + 波紋 + 反射
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488cc', '#66aadd', '#88ccee'];
interface PoolParticle extends Particle { type: 'ripple' | 'reflect'; size: number; maxSize: number; color: string; }
export const poolEffect: Effect = {
  config: { name: 'pool', description: '水溜り + 波紋', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PoolParticle[] = [];
    const rippleCount = Math.floor(4 * intensity);
    for (let i = 0; i < rippleCount; i++) {
      particles.push({ id: generateId(), type: 'ripple', x, y, progress: 0, maxProgress: 50, delay: i * 12, alpha: 0, size: 5, maxSize: 40 + i * 10, color: DEFAULT_COLORS[i % 3] });
    }
    const reflectCount = Math.floor(5 * intensity);
    for (let i = 0; i < reflectCount; i++) {
      particles.push({ id: generateId(), type: 'reflect', x: x + random(-30, 30), y: y + random(-10, 10), progress: 0, maxProgress: 40, delay: random(0, 20), alpha: 0, size: random(2, 5), maxSize: 0, color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PoolParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'ripple') {
      p.size = p.maxSize * t;
      p.alpha = (1 - t) * 0.5;
    } else {
      p.alpha = Math.sin(t * Math.PI) * 0.8;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PoolParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'ripple') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
