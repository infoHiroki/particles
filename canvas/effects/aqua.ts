/**
 * Aqua エフェクト
 * アクア + 水 + 透明感
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ccff', '#33ddff', '#66eeff'];
interface AquaParticle extends Particle { type: 'bubble'; size: number; vy: number; wobble: number; pop: boolean; color: string; }
export const aquaEffect: Effect = {
  config: { name: 'aqua', description: 'アクア + 水', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: AquaParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'bubble', x: x + random(-40, 40), y: y + 30, progress: 0, maxProgress: 55, delay: random(0, 20), alpha: 0, size: random(4, 12), vy: random(-1.5, -0.5), wobble: random(0, Math.PI * 2), pop: false, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as AquaParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.wobble += 0.1;
    p.x += Math.sin(p.wobble) * 0.5;
    if (t > 0.9) p.pop = true;
    p.alpha = p.pop ? (1 - t) * 3 : Math.sin(t * Math.PI) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as AquaParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.pop) {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
