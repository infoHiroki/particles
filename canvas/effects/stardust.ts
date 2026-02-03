/**
 * Stardust エフェクト
 * スターダスト + 星屑 + 輝き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ffffaa', '#aaffff'];
interface StardustParticle extends Particle { type: 'dust'; size: number; vx: number; vy: number; twinkle: number; color: string; }
export const stardustEffect: Effect = {
  config: { name: 'stardust', description: 'スターダスト + 星屑', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: StardustParticle[] = [];
    const count = Math.floor(40 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(0.5, 2);
      particles.push({ id: generateId(), type: 'dust', x, y, progress: 0, maxProgress: 60, delay: random(0, 15), alpha: 0, size: random(1, 4), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, twinkle: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StardustParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.twinkle += 0.2;
    p.alpha = Math.sin(t * Math.PI) * (0.5 + Math.sin(p.twinkle) * 0.5);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StardustParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    if (p.size > 2) {
      ctx.globalAlpha = p.alpha * 0.5;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size * 2, p.y);
      ctx.lineTo(p.x + p.size * 2, p.y);
      ctx.moveTo(p.x, p.y - p.size * 2);
      ctx.lineTo(p.x, p.y + p.size * 2);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  },
};
