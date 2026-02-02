/**
 * Spider エフェクト
 * 蜘蛛 + 巣 + 糸
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#333333', '#555555', '#777777'];
interface SpiderParticle extends Particle { type: 'spider' | 'web' | 'thread'; size: number; angle: number; vy: number; color: string; }
export const spiderEffect: Effect = {
  config: { name: 'spider', description: '蜘蛛 + 巣', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: SpiderParticle[] = [];
    particles.push({ id: generateId(), type: 'spider', x, y, progress: 0, maxProgress: 65, alpha: 0, size: 12, angle: 0, vy: 0.8, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'thread', x, y: y - 50, progress: 0, maxProgress: 65, alpha: 0, size: 50, angle: 0, vy: 0, color: '#aaaaaa' });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'web', x, y, progress: 0, maxProgress: 50, delay: i * 3, alpha: 0, size: random(30, 45), angle: a, vy: 0, color: '#cccccc' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SpiderParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'spider') {
      p.y += p.vy;
      p.size = p.size + Math.sin(p.progress * 0.2) * 0.1;
    } else if (p.type === 'thread') {
      p.size += p.vy;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SpiderParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'spider') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y - p.size * 0.7, p.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const angle = (i - 1.5) * 0.3;
        ctx.beginPath();
        ctx.moveTo(p.x - p.size * 0.5, p.y);
        ctx.quadraticCurveTo(p.x - p.size * 1.5, p.y + angle * p.size, p.x - p.size * 2, p.y + p.size * (i - 1.5) * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x + p.size * 0.5, p.y);
        ctx.quadraticCurveTo(p.x + p.size * 1.5, p.y + angle * p.size, p.x + p.size * 2, p.y + p.size * (i - 1.5) * 0.5);
        ctx.stroke();
      }
    } else if (p.type === 'thread') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y + p.size);
      ctx.stroke();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.size, p.y + Math.sin(p.angle) * p.size);
      ctx.stroke();
    }
    ctx.restore();
  },
};
