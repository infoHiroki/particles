/**
 * Arrow エフェクト
 * 矢印 + 方向 + スピード
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44ff88', '#88ff44', '#ffff44'];
interface ArrowParticle extends Particle { type: 'arrow' | 'trail'; size: number; angle: number; speed: number; color: string; }
export const arrowEffect: Effect = {
  config: { name: 'arrow', description: '矢印 + スピード', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ArrowParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(-0.5, 0.5) - Math.PI / 2;
      particles.push({ id: generateId(), type: 'arrow', x, y, progress: 0, maxProgress: 45, delay: i * 5, alpha: 0, size: random(12, 20), angle, speed: random(3, 5), color: DEFAULT_COLORS[i % 3] });
    }
    const trailCount = Math.floor(8 * intensity);
    for (let i = 0; i < trailCount; i++) {
      particles.push({ id: generateId(), type: 'trail', x, y, progress: 0, maxProgress: 35, delay: random(5, 20), alpha: 0, size: random(2, 4), angle: random(-0.5, 0.5) - Math.PI / 2, speed: random(2, 4), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ArrowParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += Math.cos(p.angle) * p.speed;
    p.y += Math.sin(p.angle) * p.speed;
    p.alpha = t < 0.1 ? t / 0.1 : (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ArrowParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle + Math.PI / 2);
    if (p.type === 'arrow') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(p.size * 0.5, 0);
      ctx.lineTo(p.size * 0.2, 0);
      ctx.lineTo(p.size * 0.2, p.size * 0.6);
      ctx.lineTo(-p.size * 0.2, p.size * 0.6);
      ctx.lineTo(-p.size * 0.2, 0);
      ctx.lineTo(-p.size * 0.5, 0);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = p.color + '88';
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
