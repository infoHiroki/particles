/**
 * Reflect2 エフェクト
 * 反射 + 鏡面 + ミラー
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#eeeeff', '#ddddff'];
interface Reflect2Particle extends Particle { type: 'light'; size: number; angle: number; bounceX: number; bounceY: number; color: string; }
export const reflect2Effect: Effect = {
  config: { name: 'reflect2', description: '反射 + 鏡面', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Reflect2Particle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(-Math.PI * 0.25, Math.PI * 0.25);
      particles.push({ id: generateId(), type: 'light', x, y, progress: 0, maxProgress: 40, delay: i * 3, alpha: 0, size: random(2, 3), angle, bounceX: x + 30, bounceY: y, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Reflect2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Reflect2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.bounceX, p.bounceY);
    ctx.lineTo(p.bounceX + Math.cos(p.angle) * 40, p.bounceY + Math.sin(p.angle) * 40);
    ctx.stroke();
    ctx.restore();
  },
};
