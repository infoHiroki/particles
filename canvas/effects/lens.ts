/**
 * Lens エフェクト
 * レンズ + フレア + 収束
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffdd88', '#ffcc66', '#ffffff'];
interface LensParticle extends Particle { type: 'flare' | 'streak'; size: number; dist: number; color: string; }
export const lensEffect: Effect = {
  config: { name: 'lens', description: 'レンズ + フレア', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: LensParticle[] = [];
    particles.push({ id: generateId(), type: 'flare', x, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: 30, dist: 0, color: DEFAULT_COLORS[0] });
    const streakCount = Math.floor(6 * intensity);
    for (let i = 0; i < streakCount; i++) {
      particles.push({ id: generateId(), type: 'streak', x, y, progress: 0, maxProgress: 50, delay: 5, alpha: 0, size: random(8, 15), dist: (i + 1) * 20, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LensParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LensParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'flare') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * 0.5;
      ctx.beginPath();
      ctx.arc(p.x + p.dist, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
