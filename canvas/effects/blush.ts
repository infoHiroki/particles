/**
 * Blush エフェクト
 * 赤面 + 恥じらい + 頬
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff8888', '#ffaaaa', '#ff6666'];
interface BlushParticle extends Particle { type: 'cheek' | 'line'; size: number; offsetX: number; color: string; }
export const blushEffect: Effect = {
  config: { name: 'blush', description: '赤面 + 恥じらい', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BlushParticle[] = [];
    particles.push({ id: generateId(), type: 'cheek', x: x - 20, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 15, offsetX: -20, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'cheek', x: x + 20, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 15, offsetX: 20, color: DEFAULT_COLORS[0] });
    const lineCount = Math.floor(6 * intensity);
    for (let i = 0; i < lineCount; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      particles.push({ id: generateId(), type: 'line', x: x + side * 20, y: y + random(-8, 8), progress: 0, maxProgress: 60, delay: random(5, 15), alpha: 0, size: random(5, 10), offsetX: side * random(10, 15), color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BlushParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI) * (p.type === 'cheek' ? 0.5 : 0.7);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BlushParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'cheek') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size / 2, p.y);
      ctx.lineTo(p.x + p.size / 2, p.y);
      ctx.stroke();
    }
    ctx.restore();
  },
};
