/**
 * Swirl エフェクト
 * 渦巻き + 回転 + 吸い込み
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aa66ff', '#ff66aa', '#66aaff'];
interface SwirlParticle extends Particle { type: 'swirl'; size: number; angle: number; dist: number; spin: number; color: string; }
export const swirlEffect: Effect = {
  config: { name: 'swirl', description: '渦巻き + 吸い込み', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SwirlParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'swirl', x, y, progress: 0, maxProgress: 60, delay: i * 2, alpha: 0, size: random(3, 6), angle: random(0, Math.PI * 2), dist: 50 + random(0, 20), spin: 0.1 + random(0, 0.05), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SwirlParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.spin;
    p.dist *= 0.97;
    p.alpha = t < 0.1 ? t / 0.1 : (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SwirlParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * p.dist;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
