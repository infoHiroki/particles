/**
 * Laptop エフェクト
 * ノートPC + 作業 + コード
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44ff44', '#ffff44', '#ff4444'];
interface LaptopParticle extends Particle { type: 'laptop' | 'code' | 'cursor'; size: number; vx: number; vy: number; char: string; color: string; }
export const laptopEffect: Effect = {
  config: { name: 'laptop', description: 'ノートPC + コード', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: LaptopParticle[] = [];
    particles.push({ id: generateId(), type: 'laptop', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 35, vx: 0, vy: 0, char: '', color: '#444444' });
    const chars = ['0', '1', '{', '}', '<', '>', '/', '*'];
    const codeCount = Math.floor(12 * intensity);
    for (let i = 0; i < codeCount; i++) {
      particles.push({ id: generateId(), type: 'code', x: x + random(-20, 20), y: y - 15, progress: 0, maxProgress: 45, delay: random(5, 30), alpha: 0, size: random(8, 12), vx: random(-0.5, 0.5), vy: -random(0.5, 1.5), char: chars[Math.floor(random(0, chars.length))], color: DEFAULT_COLORS[i % 3] });
    }
    particles.push({ id: generateId(), type: 'cursor', x: x - 10, y: y - 10, progress: 0, maxProgress: 55, delay: 5, alpha: 0, size: 10, vx: 0, vy: 0, char: '|', color: '#ffffff' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LaptopParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'code') {
      p.x += p.vx;
      p.y += p.vy;
    } else if (p.type === 'cursor') {
      p.alpha = Math.abs(Math.sin(p.progress * 0.3));
      return p;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LaptopParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'laptop') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(p.x - p.size, p.y - p.size * 0.6, p.size * 2, p.size * 1.2, 3);
      ctx.fill();
      ctx.fillStyle = '#333355';
      ctx.fillRect(p.x - p.size * 0.9, p.y - p.size * 0.5, p.size * 1.8, p.size);
      ctx.fillStyle = '#555555';
      ctx.beginPath();
      ctx.moveTo(p.x - p.size * 1.2, p.y + p.size * 0.7);
      ctx.lineTo(p.x + p.size * 1.2, p.y + p.size * 0.7);
      ctx.lineTo(p.x + p.size, p.y + p.size * 0.6);
      ctx.lineTo(p.x - p.size, p.y + p.size * 0.6);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.font = `${p.size}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.char, p.x, p.y);
    }
    ctx.restore();
  },
};
