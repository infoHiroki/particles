/**
 * Orbit3 エフェクト
 * 軌道 + 周回 + 衛星
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa00', '#ffcc44', '#ffee88'];
interface Orbit3Particle extends Particle { type: 'satellite'; size: number; angle: number; dist: number; rotSpeed: number; tilt: number; color: string; }
export const orbit3Effect: Effect = {
  config: { name: 'orbit3', description: '軌道 + 周回', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Orbit3Particle[] = [];
    const count = Math.floor(6 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'satellite', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: random(4, 8), angle: (i / count) * Math.PI * 2, dist: random(25, 45), rotSpeed: random(0.05, 0.1), tilt: random(0.3, 0.5), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Orbit3Particle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.rotSpeed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Orbit3Particle;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * p.dist * p.tilt;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
