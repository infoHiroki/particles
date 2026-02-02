/**
 * Hexgrid エフェクト
 * 六角形グリッド + ハニカム + 蜂の巣
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa00', '#ffcc44', '#ffee88'];
interface HexgridParticle extends Particle { type: 'hex'; size: number; gridX: number; gridY: number; color: string; }
export const hexgridEffect: Effect = {
  config: { name: 'hexgrid', description: '六角形グリッド + ハニカム', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HexgridParticle[] = [];
    const gridSize = Math.floor(2 * intensity);
    const hexSize = 15;
    for (let gx = -gridSize; gx <= gridSize; gx++) {
      for (let gy = -gridSize; gy <= gridSize; gy++) {
        const offsetX = gy % 2 === 0 ? 0 : hexSize * 0.866;
        particles.push({ id: generateId(), type: 'hex', x, y, progress: 0, maxProgress: 50, delay: (Math.abs(gx) + Math.abs(gy)) * 3, alpha: 0, size: hexSize, gridX: gx * hexSize * 1.732 + offsetX, gridY: gy * hexSize * 1.5, color: DEFAULT_COLORS[(gx + gy + 10) % 3] });
      }
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HexgridParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HexgridParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x + p.gridX, p.y + p.gridY);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = Math.cos(angle) * p.size;
      const py = Math.sin(angle) * p.size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  },
};
