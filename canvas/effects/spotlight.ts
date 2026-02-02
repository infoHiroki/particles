/**
 * Spotlight エフェクト
 * スポットライト + 照明 + 舞台
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffcc', '#ffff99', '#ffff66'];
interface SpotlightParticle extends Particle { type: 'cone'; size: number; angle: number; swing: number; color: string; }
export const spotlightEffect: Effect = {
  config: { name: 'spotlight', description: 'スポットライト + 照明', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SpotlightParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'cone', x: x + (i - 1) * 40, y: y - 50, progress: 0, maxProgress: 80, delay: i * 10, alpha: 0, size: 60, angle: Math.PI / 2, swing: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SpotlightParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.swing += 0.05;
    p.angle = Math.PI / 2 + Math.sin(p.swing) * 0.3;
    p.alpha = Math.sin(t * Math.PI) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SpotlightParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle - Math.PI / 2);
    const grad = ctx.createRadialGradient(0, p.size / 2, 0, 0, p.size / 2, p.size);
    grad.addColorStop(0, p.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-p.size / 3, p.size);
    ctx.lineTo(p.size / 3, p.size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
