/**
 * Swim エフェクト
 * 水泳 + 水しぶき + スピード
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aaff', '#88ccff', '#ffffff'];
interface SwimParticle extends Particle { type: 'splash' | 'ripple' | 'bubble'; size: number; vx: number; vy: number; color: string; }
export const swimEffect: Effect = {
  config: { name: 'swim', description: '水泳 + 水しぶき', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SwimParticle[] = [];
    const splashCount = Math.floor(12 * intensity);
    for (let i = 0; i < splashCount; i++) {
      const angle = random(-Math.PI * 0.8, -Math.PI * 0.2);
      const speed = random(2, 4);
      particles.push({ id: generateId(), type: 'splash', x, y, progress: 0, maxProgress: 40, delay: random(0, 8), alpha: 0, size: random(3, 7), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: DEFAULT_COLORS[i % 3] });
    }
    for (let i = 0; i < 3; i++) {
      particles.push({ id: generateId(), type: 'ripple', x, y, progress: 0, maxProgress: 50, delay: i * 8, alpha: 0, size: 10, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    }
    const bubbleCount = Math.floor(6 * intensity);
    for (let i = 0; i < bubbleCount; i++) {
      particles.push({ id: generateId(), type: 'bubble', x: x + random(-20, 20), y: y + random(5, 20), progress: 0, maxProgress: 45, delay: random(5, 20), alpha: 0, size: random(2, 5), vx: random(-0.3, 0.3), vy: -random(0.5, 1.2), color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SwimParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'splash') {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
    } else if (p.type === 'ripple') {
      p.size += 1.5;
    } else {
      p.x += p.vx;
      p.y += p.vy;
    }
    p.alpha = t < 0.1 ? t / 0.1 : (1 - t) * (p.type === 'ripple' ? 0.6 : 0.8);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SwimParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'splash') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'ripple') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
