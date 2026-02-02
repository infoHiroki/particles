/**
 * Butterfly エフェクト
 * 蝶 + 羽ばたき + 優雅
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff88cc', '#ffaa88', '#88ddff'];
interface ButterflyParticle extends Particle { type: 'butterfly' | 'trail'; size: number; wingAngle: number; vx: number; vy: number; color: string; }
export const butterflyEffect: Effect = {
  config: { name: 'butterfly', description: '蝶 + 羽ばたき', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ButterflyParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'butterfly', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 80, delay: i * 10, alpha: 0, size: random(12, 18), wingAngle: 0, vx: random(-1, 1), vy: random(-1.5, -0.5), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ButterflyParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx + Math.sin(p.progress * 0.1) * 0.5;
    p.y += p.vy;
    p.wingAngle = Math.sin(p.progress * 0.4) * 0.8;
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ButterflyParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(-p.size * 0.5 * Math.cos(p.wingAngle), 0, p.size * 0.6, p.size * 0.4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(p.size * 0.5 * Math.cos(p.wingAngle), 0, p.size * 0.6, p.size * 0.4, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.15, p.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
