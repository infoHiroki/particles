/**
 * Checker エフェクト
 * チェッカー + 市松模様 + 格子
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#222222', '#eeeeee', '#888888'];
interface CheckerParticle extends Particle { type: 'square'; size: number; gridX: number; gridY: number; isBlack: boolean; color: string; }
export const checkerEffect: Effect = {
  config: { name: 'checker', description: 'チェッカー + 市松模様', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CheckerParticle[] = [];
    const gridSize = Math.floor(3 * intensity);
    const cellSize = 12;
    for (let gx = -gridSize; gx <= gridSize; gx++) {
      for (let gy = -gridSize; gy <= gridSize; gy++) {
        const isBlack = (gx + gy) % 2 === 0;
        particles.push({ id: generateId(), type: 'square', x, y, progress: 0, maxProgress: 50, delay: (Math.abs(gx) + Math.abs(gy)) * 2, alpha: 0, size: cellSize, gridX: gx * cellSize, gridY: gy * cellSize, isBlack, color: isBlack ? DEFAULT_COLORS[0] : DEFAULT_COLORS[1] });
      }
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CheckerParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CheckerParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x + p.gridX - p.size / 2, p.y + p.gridY - p.size / 2, p.size, p.size);
    ctx.restore();
  },
};
