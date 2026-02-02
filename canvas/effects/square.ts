/**
 * Square エフェクト
 * 四角 + 回転 + タイル
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff8844', '#44ff88', '#4488ff'];
interface SquareParticle extends Particle { type: 'square'; size: number; rotation: number; spin: number; vx: number; vy: number; color: string; }
export const squareEffect: Effect = {
  config: { name: 'square', description: '四角 + 回転', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SquareParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 2.5);
      particles.push({ id: generateId(), type: 'square', x, y, progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, size: random(8, 16), rotation: random(0, Math.PI), spin: random(-0.1, 0.1), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SquareParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.spin;
    p.alpha = t < 0.1 ? t / 0.1 : (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SquareParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  },
};
