/**
 * Apple エフェクト
 * りんご + 落下 + 葉
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4444', '#ff2222', '#cc0000'];
interface AppleParticle extends Particle { type: 'apple' | 'leaf' | 'shine'; size: number; vy: number; rotation: number; color: string; }
export const appleEffect: Effect = {
  config: { name: 'apple', description: 'りんご + 落下', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: AppleParticle[] = [];
    particles.push({ id: generateId(), type: 'apple', x, y, progress: 0, maxProgress: 55, alpha: 0, size: 22, vy: 0.5, rotation: random(-0.1, 0.1), color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'leaf', x: x + 5, y: y - 20, progress: 0, maxProgress: 50, delay: 5, alpha: 0, size: 8, vy: 0.3, rotation: random(-0.3, 0.3), color: '#44aa44' });
    const shineCount = Math.floor(3 * intensity);
    for (let i = 0; i < shineCount; i++) {
      particles.push({ id: generateId(), type: 'shine', x: x + random(-15, 5), y: y + random(-15, 5), progress: 0, maxProgress: 40, delay: random(5, 20), alpha: 0, size: random(2, 4), vy: 0, rotation: 0, color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as AppleParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'apple' || p.type === 'leaf') {
      p.y += p.vy;
      p.rotation += 0.01;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as AppleParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.type === 'apple') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#883300';
      ctx.fillRect(-2, -p.size - 6, 4, 8);
    } else if (p.type === 'leaf') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.4, 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
