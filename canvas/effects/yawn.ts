/**
 * Yawn エフェクト
 * あくび + 眠気 + 疲れ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aaaacc', '#8888aa', '#ccccee'];
interface YawnParticle extends Particle { type: 'breath' | 'tear'; size: number; vx: number; vy: number; color: string; }
export const yawnEffect: Effect = {
  config: { name: 'yawn', description: 'あくび + 眠気', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: YawnParticle[] = [];
    const breathCount = Math.floor(8 * intensity);
    for (let i = 0; i < breathCount; i++) {
      particles.push({ id: generateId(), type: 'breath', x: x + 15, y, progress: 0, maxProgress: 50, delay: i * 5, alpha: 0, size: random(5, 10), vx: random(1, 2), vy: random(-0.5, 0.5), color: DEFAULT_COLORS[i % 3] });
    }
    particles.push({ id: generateId(), type: 'tear', x: x - 10, y: y + 5, progress: 0, maxProgress: 40, delay: 20, alpha: 0, size: 4, vx: 0, vy: 0.5, color: '#88ccff' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as YawnParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'breath') {
      p.size += 0.1;
      p.alpha = (1 - t) * 0.4;
    } else {
      p.alpha = Math.sin(t * Math.PI);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as YawnParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'breath') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = p.color;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
