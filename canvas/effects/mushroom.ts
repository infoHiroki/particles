/**
 * Mushroom エフェクト
 * キノコ + 森 + ファンタジー
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4444', '#ff6666', '#ffffff'];
interface MushroomParticle extends Particle { type: 'cap' | 'stem' | 'spot' | 'spore'; size: number; vx: number; vy: number; color: string; }
export const mushroomEffect: Effect = {
  config: { name: 'mushroom', description: 'キノコ + 森', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MushroomParticle[] = [];
    particles.push({ id: generateId(), type: 'stem', x, y: y + 10, progress: 0, maxProgress: 60, alpha: 0, size: 12, vx: 0, vy: 0, color: '#eeeecc' });
    particles.push({ id: generateId(), type: 'cap', x, y: y - 5, progress: 0, maxProgress: 55, delay: 3, alpha: 0, size: 22, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    for (let i = 0; i < 5; i++) {
      particles.push({ id: generateId(), type: 'spot', x: x + random(-12, 12), y: y - 8 + random(-8, 5), progress: 0, maxProgress: 50, delay: 8 + i * 2, alpha: 0, size: random(3, 5), vx: 0, vy: 0, color: DEFAULT_COLORS[2] });
    }
    const sporeCount = Math.floor(8 * intensity);
    for (let i = 0; i < sporeCount; i++) {
      particles.push({ id: generateId(), type: 'spore', x: x + random(-15, 15), y: y + 5, progress: 0, maxProgress: 45, delay: random(15, 35), alpha: 0, size: random(1, 3), vx: random(-0.3, 0.3), vy: random(0.3, 0.8), color: '#ffddaa' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MushroomParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'spore') {
      p.x += p.vx;
      p.y += p.vy;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MushroomParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'stem') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size * 0.4, p.y);
      ctx.lineTo(p.x - p.size * 0.3, p.y + p.size);
      ctx.lineTo(p.x + p.size * 0.3, p.y + p.size);
      ctx.lineTo(p.x + p.size * 0.4, p.y);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'cap') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.5, 0, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'spot') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
