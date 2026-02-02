/**
 * Circle エフェクト
 * 円 + 回転 + シンプル
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6688', '#66ff88', '#6688ff'];
interface CircleParticle extends Particle { type: 'circle' | 'ring'; size: number; rotation: number; spin: number; color: string; }
export const circleEffect: Effect = {
  config: { name: 'circle', description: '円 + 回転', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CircleParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'circle', x, y, progress: 0, maxProgress: 50, delay: i * 5, alpha: 0, size: 15 + i * 8, rotation: 0, spin: random(-0.05, 0.05), color: DEFAULT_COLORS[i % 3] });
    }
    for (let i = 0; i < 3; i++) {
      particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 45, delay: i * 8, alpha: 0, size: 20 + i * 15, rotation: 0, spin: 0, color: DEFAULT_COLORS[i] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CircleParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.rotation += p.spin;
    if (p.type === 'ring') p.size += 0.5;
    p.alpha = t < 0.15 ? t / 0.15 : (1 - t) * (p.type === 'ring' ? 0.6 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CircleParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.type === 'circle') {
      ctx.fillStyle = p.color + '88';
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
