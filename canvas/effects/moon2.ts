/**
 * Moon2 エフェクト
 * 月 + 三日月 + 夜
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffcc', '#ffeeaa', '#ffdd88'];
interface Moon2Particle extends Particle { type: 'moon' | 'sparkle'; size: number; color: string; }
export const moon2Effect: Effect = {
  config: { name: 'moon2', description: '月 + 三日月', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Moon2Particle[] = [];
    particles.push({ id: generateId(), type: 'moon', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 25, color: DEFAULT_COLORS[0] });
    const sparkleCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-40, 40), y: y + random(-40, 40), progress: 0, maxProgress: 50, delay: random(10, 30), alpha: 0, size: random(1, 3), color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Moon2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Moon2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'moon') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(p.x + p.size * 0.4, p.y, p.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
