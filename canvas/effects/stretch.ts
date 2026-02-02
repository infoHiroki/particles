/**
 * Stretch エフェクト
 * ストレッチ + 伸縮 + 伸び
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88cc44', '#99dd55', '#aaee66'];
interface StretchParticle extends Particle { type: 'bar'; size: number; stretchX: number; stretchY: number; horizontal: boolean; color: string; }
export const stretchEffect: Effect = {
  config: { name: 'stretch', description: 'ストレッチ + 伸縮', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: StretchParticle[] = [];
    const count = Math.floor(6 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'bar', x: x + random(-20, 20), y: y + random(-20, 20), progress: 0, maxProgress: 50, delay: i * 4, alpha: 0, size: random(6, 10), stretchX: 1, stretchY: 1, horizontal: i % 2 === 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StretchParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const stretch = 1 + Math.sin(t * Math.PI * 2) * 2;
    if (p.horizontal) {
      p.stretchX = stretch;
      p.stretchY = 1 / stretch;
    } else {
      p.stretchX = 1 / stretch;
      p.stretchY = stretch;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StretchParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.scale(p.stretchX, p.stretchY);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
