/**
 * Pixel2 エフェクト
 * ピクセル + ドット + 8bit
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
interface Pixel2Particle extends Particle { type: 'pixel'; size: number; gridX: number; gridY: number; color: string; }
export const pixel2Effect: Effect = {
  config: { name: 'pixel2', description: 'ピクセル + ドット', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Pixel2Particle[] = [];
    const gridSize = Math.floor(4 * intensity);
    const pixelSize = 6;
    for (let gx = -gridSize; gx <= gridSize; gx++) {
      for (let gy = -gridSize; gy <= gridSize; gy++) {
        if (Math.random() > 0.5) {
          particles.push({ id: generateId(), type: 'pixel', x, y, progress: 0, maxProgress: 45, delay: (Math.abs(gx) + Math.abs(gy)) * 2, alpha: 0, size: pixelSize, gridX: gx * pixelSize, gridY: gy * pixelSize, color: DEFAULT_COLORS[Math.floor(Math.random() * 6)] });
        }
      }
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Pixel2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Pixel2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x + p.gridX, p.y + p.gridY, p.size, p.size);
    ctx.restore();
  },
};
