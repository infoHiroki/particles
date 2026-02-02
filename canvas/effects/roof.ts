/**
 * Roof エフェクト
 * 屋根 + 覆い + 三角
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#884433', '#996644', '#aa7755'];
interface RoofParticle extends Particle { type: 'tile' | 'chimney'; size: number; row: number; col: number; color: string; }
export const roofEffect: Effect = {
  config: { name: 'roof', description: '屋根 + 覆い', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RoofParticle[] = [];
    const rows = Math.floor(4 * intensity);
    for (let row = 0; row < rows; row++) {
      const cols = rows - row;
      for (let col = 0; col < cols; col++) {
        const px = x - (cols - 1) * 10 + col * 20;
        const py = y + row * 10;
        particles.push({ id: generateId(), type: 'tile', x: px, y: py, progress: 0, maxProgress: 60, delay: row * 5 + col * 2, alpha: 0, size: 18, row, col, color: DEFAULT_COLORS[(row + col) % 3] });
      }
    }
    particles.push({ id: generateId(), type: 'chimney', x: x + 20, y: y - 10, progress: 0, maxProgress: 60, delay: rows * 5, alpha: 0, size: 15, row: 0, col: 0, color: '#666666' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RoofParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RoofParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'tile') {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 8);
      ctx.lineTo(p.x + p.size / 2, p.y + 5);
      ctx.lineTo(p.x - p.size / 2, p.y + 5);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillRect(p.x - 5, p.y - p.size, 10, p.size);
    }
    ctx.restore();
  },
};
