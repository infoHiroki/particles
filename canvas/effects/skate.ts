/**
 * Skate エフェクト
 * スケート + 氷 + スピード
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aaddff', '#88ccff', '#ffffff'];
interface SkateParticle extends Particle { type: 'ice' | 'trail' | 'sparkle'; size: number; vx: number; vy: number; color: string; }
export const skateEffect: Effect = {
  config: { name: 'skate', description: 'スケート + 氷', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SkateParticle[] = [];
    const iceCount = Math.floor(12 * intensity);
    for (let i = 0; i < iceCount; i++) {
      particles.push({ id: generateId(), type: 'ice', x: x + random(-15, 15), y: y + random(0, 10), progress: 0, maxProgress: 40, delay: random(0, 10), alpha: 0, size: random(2, 5), vx: random(-1.5, 1.5), vy: random(-1, 0.5), color: DEFAULT_COLORS[i % 3] });
    }
    for (let i = 0; i < 2; i++) {
      particles.push({ id: generateId(), type: 'trail', x: x + (i - 0.5) * 10, y: y + 5, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: 30, vx: -2, vy: 0, color: DEFAULT_COLORS[0] });
    }
    const sparkleCount = Math.floor(6 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-20, 20), y: y + random(-5, 10), progress: 0, maxProgress: 35, delay: random(5, 20), alpha: 0, size: random(1, 3), vx: 0, vy: 0, color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SkateParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'ice') {
      p.vy += 0.02;
    }
    p.alpha = t < 0.1 ? t / 0.1 : (1 - t) * (p.type === 'sparkle' ? Math.abs(Math.sin(p.progress * 0.3)) : 0.8);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SkateParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'ice') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.lineTo(p.x + p.size * 0.5, p.y);
      ctx.lineTo(p.x, p.y + p.size * 0.5);
      ctx.lineTo(p.x - p.size * 0.5, p.y);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'trail') {
      ctx.strokeStyle = p.color + '66';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.size, p.y);
      ctx.stroke();
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
