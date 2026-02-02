/**
 * Cat エフェクト
 * 猫 + 肉球 + かわいい
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcccc', '#ffaaaa', '#ff8888'];
interface CatParticle extends Particle { type: 'paw' | 'heart'; size: number; vy: number; rotation: number; color: string; }
export const catEffect: Effect = {
  config: { name: 'cat', description: '猫 + 肉球', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CatParticle[] = [];
    const pawCount = Math.floor(5 * intensity);
    for (let i = 0; i < pawCount; i++) {
      particles.push({ id: generateId(), type: 'paw', x: x + random(-40, 40), y: y + random(-30, 30), progress: 0, maxProgress: 50, delay: i * 5, alpha: 0, size: random(12, 18), vy: random(-0.5, 0.5), rotation: random(-0.3, 0.3), color: DEFAULT_COLORS[i % 3] });
    }
    for (let i = 0; i < 3; i++) {
      particles.push({ id: generateId(), type: 'heart', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 45, delay: random(10, 25), alpha: 0, size: random(6, 10), vy: -random(0.8, 1.5), rotation: 0, color: '#ff6688' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CatParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    if (p.type === 'heart') p.x += Math.sin(p.progress * 0.2) * 0.5;
    p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CatParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.type === 'paw') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, p.size * 0.2, p.size * 0.5, p.size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      const toePositions = [[-p.size * 0.35, -p.size * 0.25], [0, -p.size * 0.35], [p.size * 0.35, -p.size * 0.25]];
      for (const [tx, ty] of toePositions) {
        ctx.beginPath();
        ctx.ellipse(tx, ty, p.size * 0.2, p.size * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, p.size * 0.3);
      ctx.bezierCurveTo(-p.size * 0.5, -p.size * 0.3, -p.size * 0.5, -p.size * 0.8, 0, -p.size * 0.4);
      ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.8, p.size * 0.5, -p.size * 0.3, 0, p.size * 0.3);
      ctx.fill();
    }
    ctx.restore();
  },
};
