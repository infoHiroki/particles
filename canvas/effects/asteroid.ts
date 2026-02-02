/**
 * Asteroid エフェクト
 * 小惑星 + 回転 + 岩石
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#887766', '#665544', '#998877'];
interface AsteroidParticle extends Particle { type: 'rock'; size: number; rotation: number; rotSpeed: number; vx: number; vy: number; points: number[]; color: string; }
export const asteroidEffect: Effect = {
  config: { name: 'asteroid', description: '小惑星 + 回転', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: AsteroidParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      const points: number[] = [];
      const segments = Math.floor(random(5, 8));
      for (let j = 0; j < segments; j++) {
        points.push(random(0.6, 1.0));
      }
      particles.push({ id: generateId(), type: 'rock', x, y, progress: 0, maxProgress: 80, delay: random(0, 15), alpha: 0, size: random(8, 20), rotation: random(0, Math.PI * 2), rotSpeed: random(-0.05, 0.05), vx: random(-1.5, 1.5), vy: random(-1.5, 1.5), points, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as AsteroidParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as AsteroidParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    const segments = p.points.length;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r = p.size * p.points[i % segments];
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
