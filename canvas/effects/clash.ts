/**
 * Clash エフェクト
 * クラッシュ + 衝突 + 激突
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ffff00', '#ff8800'];
interface ClashParticle extends Particle { type: 'flash' | 'spark'; size: number; vx: number; vy: number; color: string; }
export const clashEffect: Effect = {
  config: { name: 'clash', description: 'クラッシュ + 衝突', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ClashParticle[] = [];
    particles.push({ id: generateId(), type: 'flash', x, y, progress: 0, maxProgress: 15, delay: 0, alpha: 0, size: 40, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    const sparkCount = Math.floor(20 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(4, 8);
      particles.push({ id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 30, delay: 3, alpha: 0, size: random(2, 5), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ClashParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'spark') {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
    } else {
      p.size += 5;
    }
    p.alpha = 1 - t;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ClashParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'flash') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.type === 'flash' ? p.size : p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
