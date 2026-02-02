/**
 * Dots エフェクト
 * ドット + 水玉 + 点々
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44cc88', '#55dd99', '#66eeaa'];
interface DotsParticle extends Particle { type: 'dot'; size: number; gridX: number; gridY: number; color: string; }
export const dotsEffect: Effect = {
  config: { name: 'dots', description: 'ドット + 水玉', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DotsParticle[] = [];
    const gridSize = Math.floor(4 * intensity);
    for (let gx = -gridSize; gx <= gridSize; gx++) {
      for (let gy = -gridSize; gy <= gridSize; gy++) {
        particles.push({ id: generateId(), type: 'dot', x, y, progress: 0, maxProgress: 50, delay: (Math.abs(gx) + Math.abs(gy)) * 2, alpha: 0, size: random(3, 5), gridX: gx * 15, gridY: gy * 15, color: DEFAULT_COLORS[(gx + gy + 10) % 3] });
      }
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DotsParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DotsParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x + p.gridX, p.y + p.gridY, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
