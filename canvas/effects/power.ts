/**
 * Power エフェクト
 * パワー + 力 + 強さ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4444', '#ff6666', '#ff8888'];
interface PowerParticle extends Particle { type: 'burst' | 'spark'; size: number; vx: number; vy: number; color: string; }
export const powerEffect: Effect = {
  config: { name: 'power', description: 'パワー + 力', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PowerParticle[] = [];
    particles.push({ id: generateId(), type: 'burst', x, y, progress: 0, maxProgress: 40, delay: 0, alpha: 0, size: 30, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    const sparkCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(2, 5);
      particles.push({ id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 35, delay: 5, alpha: 0, size: random(3, 6), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PowerParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'spark') {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
    } else {
      p.size += 2;
    }
    p.alpha = p.type === 'burst' ? (1 - t) * 0.5 : (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PowerParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'burst') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
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
