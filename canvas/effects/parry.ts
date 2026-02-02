/**
 * Parry エフェクト
 * パリィ + 受け流し + 防御
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ccff', '#aaddff', '#cceeff'];
interface ParryParticle extends Particle { type: 'arc' | 'spark'; size: number; angle: number; vx: number; vy: number; color: string; }
export const parryEffect: Effect = {
  config: { name: 'parry', description: 'パリィ + 受け流し', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ParryParticle[] = [];
    particles.push({ id: generateId(), type: 'arc', x, y, progress: 0, maxProgress: 25, delay: 0, alpha: 0, size: 30, angle: -Math.PI / 4, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    const sparkCount = Math.floor(8 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(-Math.PI / 2, 0);
      const speed = random(2, 5);
      particles.push({ id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 30, delay: 5, alpha: 0, size: random(2, 4), angle: 0, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ParryParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'spark') {
      p.x += p.vx;
      p.y += p.vy;
    } else {
      p.angle += 0.15;
    }
    p.alpha = 1 - t;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ParryParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'arc') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, p.angle, p.angle + Math.PI / 2);
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
