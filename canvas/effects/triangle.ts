/**
 * Triangle エフェクト
 * 三角 + 回転 + 幾何学
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff66aa', '#66ffaa', '#aa66ff'];
interface TriangleParticle extends Particle { type: 'triangle'; size: number; rotation: number; spin: number; vx: number; vy: number; color: string; }
export const triangleEffect: Effect = {
  config: { name: 'triangle', description: '三角 + 幾何学', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TriangleParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 2);
      particles.push({ id: generateId(), type: 'triangle', x, y, progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, size: random(8, 15), rotation: random(0, Math.PI * 2), spin: random(-0.08, 0.08), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TriangleParticle;
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
    const p = particle as TriangleParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.lineTo(p.size * 0.866, p.size * 0.5);
    ctx.lineTo(-p.size * 0.866, p.size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
