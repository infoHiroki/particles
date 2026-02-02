/**
 * Scatter エフェクト
 * スキャター + 散らばり + 飛散
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff8844', '#ff9955', '#ffaa66'];
interface ScatterParticle extends Particle { type: 'piece'; size: number; vx: number; vy: number; color: string; }
export const scatterEffect: Effect = {
  config: { name: 'scatter', description: 'スキャター + 散らばり', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ScatterParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(2, 5);
      particles.push({ id: generateId(), type: 'piece', x, y, progress: 0, maxProgress: 45, delay: random(0, 5), alpha: 0, size: random(3, 7), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ScatterParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.alpha = 1 - t;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ScatterParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
