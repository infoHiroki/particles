/**
 * Sleet エフェクト
 * みぞれ + 雨雪 + 霙
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aabbcc', '#99aadd', '#ffffff'];
interface SleetParticle extends Particle { type: 'rain' | 'snow'; size: number; vx: number; vy: number; wobble: number; color: string; }
export const sleetEffect: Effect = {
  config: { name: 'sleet', description: 'みぞれ + 雨雪', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SleetParticle[] = [];
    const rainCount = Math.floor(15 * intensity);
    for (let i = 0; i < rainCount; i++) {
      particles.push({ id: generateId(), type: 'rain', x: x + random(-50, 50), y: y + random(-40, 40), progress: 0, maxProgress: 40, delay: random(0, 15), alpha: 0, size: random(1, 2), vx: random(-1, 0), vy: random(5, 8), wobble: 0, color: DEFAULT_COLORS[0] });
    }
    const snowCount = Math.floor(15 * intensity);
    for (let i = 0; i < snowCount; i++) {
      particles.push({ id: generateId(), type: 'snow', x: x + random(-50, 50), y: y + random(-40, 40), progress: 0, maxProgress: 50, delay: random(0, 20), alpha: 0, size: random(2, 4), vx: random(-0.5, 0.5), vy: random(2, 4), wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SleetParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'snow') {
      p.wobble += 0.1;
      p.x += p.vx + Math.sin(p.wobble) * 0.3;
    } else {
      p.x += p.vx;
    }
    p.y += p.vy;
    p.alpha = p.type === 'rain' ? 0.6 : 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SleetParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'rain') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
