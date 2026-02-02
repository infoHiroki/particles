/**
 * Shooting エフェクト
 * 流れ星 + 願い + 光跡
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#aaddff', '#ffddaa'];
interface ShootingParticle extends Particle { type: 'star' | 'trail' | 'sparkle'; size: number; vx: number; vy: number; tailLength: number; color: string; }
export const shootingEffect: Effect = {
  config: { name: 'shooting', description: '流れ星 + 願い', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ShootingParticle[] = [];
    const angle = random(0.3, 0.7);
    const speed = random(6, 10);
    particles.push({ id: generateId(), type: 'star', x, y, progress: 0, maxProgress: 40, alpha: 0, size: 6, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, tailLength: 0, color: DEFAULT_COLORS[0] });
    const trailCount = Math.floor(12 * intensity);
    for (let i = 0; i < trailCount; i++) {
      particles.push({ id: generateId(), type: 'trail', x, y, progress: 0, maxProgress: 35, delay: i * 1.5, alpha: 0, size: 4 - i * 0.2, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, tailLength: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const sparkleCount = Math.floor(5 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-20, 20), y: y + random(-10, 30), progress: 0, maxProgress: 30, delay: random(5, 20), alpha: 0, size: random(1, 3), vx: random(-0.5, 0.5), vy: random(0, 0.5), tailLength: 0, color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ShootingParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type !== 'sparkle') {
      p.vx *= 0.98;
      p.vy *= 0.98;
    }
    p.alpha = t < 0.1 ? t / 0.1 : (1 - t) / 0.9;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ShootingParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'star') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'trail') {
      ctx.fillStyle = p.color + '88';
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
