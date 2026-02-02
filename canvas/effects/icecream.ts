/**
 * Icecream エフェクト
 * アイスクリーム + 冷たい + 甘い
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffccdd', '#aaddff', '#ffffcc'];
interface IcecreamParticle extends Particle { type: 'cone' | 'scoop' | 'drip' | 'sparkle'; size: number; vy: number; scoopIndex: number; color: string; }
export const icecreamEffect: Effect = {
  config: { name: 'icecream', description: 'アイスクリーム + 冷たい', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: IcecreamParticle[] = [];
    particles.push({ id: generateId(), type: 'cone', x, y: y + 20, progress: 0, maxProgress: 60, alpha: 0, size: 18, vy: 0, scoopIndex: 0, color: '#cc9944' });
    for (let i = 0; i < 3; i++) {
      particles.push({ id: generateId(), type: 'scoop', x, y: y - i * 16, progress: 0, maxProgress: 55, delay: i * 3, alpha: 0, size: 16 - i * 2, vy: 0, scoopIndex: i, color: DEFAULT_COLORS[i % 3] });
    }
    const dripCount = Math.floor(3 * intensity);
    for (let i = 0; i < dripCount; i++) {
      particles.push({ id: generateId(), type: 'drip', x: x + random(-10, 10), y: y + 5, progress: 0, maxProgress: 50, delay: random(15, 35), alpha: 0, size: random(3, 5), vy: random(0.5, 1), scoopIndex: 0, color: DEFAULT_COLORS[i % 3] });
    }
    for (let i = 0; i < 4; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-15, 15), y: y + random(-30, 10), progress: 0, maxProgress: 40, delay: random(10, 30), alpha: 0, size: random(2, 3), vy: 0, scoopIndex: 0, color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as IcecreamParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'drip') {
      p.y += p.vy;
      p.size *= 0.98;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as IcecreamParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'cone') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size, p.y - p.size * 0.5);
      ctx.lineTo(p.x, p.y + p.size * 1.5);
      ctx.lineTo(p.x + p.size, p.y - p.size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#aa7722';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(p.x - p.size + i * 5, p.y - p.size * 0.3);
        ctx.lineTo(p.x - 5 + i * 5, p.y + p.size);
        ctx.stroke();
      }
    } else if (p.type === 'scoop') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'drip') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
