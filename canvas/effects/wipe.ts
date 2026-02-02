/**
 * Wipe エフェクト
 * ワイプ + 拭き取り + 遷移
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#ffffff'];
interface WipeParticle extends Particle { type: 'bar' | 'trail'; size: number; posX: number; speed: number; color: string; }
export const wipeEffect: Effect = {
  config: { name: 'wipe', description: 'ワイプ + 拭き取り', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: WipeParticle[] = [];
    particles.push({ id: generateId(), type: 'bar', x: x - 50, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: 80, posX: x - 50, speed: 3, color: DEFAULT_COLORS[0] });
    const trailCount = Math.floor(10 * intensity);
    for (let i = 0; i < trailCount; i++) {
      particles.push({ id: generateId(), type: 'trail', x: x - 50 + i * 5, y: y + random(-30, 30), progress: 0, maxProgress: 40, delay: i * 3, alpha: 0, size: random(3, 6), posX: 0, speed: 2.5, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WipeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.speed;
    p.alpha = p.type === 'bar' ? 0.8 : (1 - t) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WipeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'bar') {
      const grad = ctx.createLinearGradient(p.x - 10, p.y, p.x + 10, p.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x - 5, p.y - p.size / 2, 10, p.size);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
