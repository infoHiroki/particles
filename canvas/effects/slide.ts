/**
 * Slide エフェクト
 * スライド + 移動 + 遷移
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44ff88', '#88ffaa', '#ffffff'];
interface SlideParticle extends Particle { type: 'panel' | 'trail'; size: number; vx: number; startX: number; color: string; }
export const slideEffect: Effect = {
  config: { name: 'slide', description: 'スライド + 移動', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SlideParticle[] = [];
    particles.push({ id: generateId(), type: 'panel', x: x - 60, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: 50, vx: 3, startX: x - 60, color: DEFAULT_COLORS[0] });
    const trailCount = Math.floor(8 * intensity);
    for (let i = 0; i < trailCount; i++) {
      particles.push({ id: generateId(), type: 'trail', x: x - 60 - i * 8, y: y + random(-20, 20), progress: 0, maxProgress: 40, delay: i * 2, alpha: 0, size: random(3, 6), vx: 2.5, startX: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SlideParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx * (1 - t * 0.5);
    p.alpha = p.type === 'panel' ? Math.sin(t * Math.PI) : (1 - t) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SlideParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'panel') {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
