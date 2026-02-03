/**
 * Splash2 エフェクト
 * スプラッシュ2 + 水しぶき + 飛沫
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#88ccff'];
interface Splash2Particle extends Particle { type: 'drop'; size: number; vx: number; vy: number; color: string; }
export const splash2Effect: Effect = {
  config: { name: 'splash2', description: 'スプラッシュ2 + 水しぶき', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Splash2Particle[] = [];
    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(-Math.PI * 0.8, -Math.PI * 0.2);
      const speed = random(4, 10);
      particles.push({ id: generateId(), type: 'drop', x, y, progress: 0, maxProgress: 40, delay: random(0, 3), alpha: 0, size: random(3, 8), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Splash2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.3;
    p.size *= 0.98;
    p.alpha = (1 - t) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Splash2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
