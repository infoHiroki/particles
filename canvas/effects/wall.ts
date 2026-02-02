/**
 * Wall エフェクト
 * 壁 + 防御 + レンガ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#884422', '#996633', '#aa7744'];
interface WallParticle extends Particle { type: 'brick'; size: number; row: number; col: number; color: string; }
export const wallEffect: Effect = {
  config: { name: 'wall', description: '壁 + 防御', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: WallParticle[] = [];
    const rows = Math.floor(4 * intensity);
    const cols = 5;
    for (let row = 0; row < rows; row++) {
      const offset = row % 2 === 0 ? 0 : 10;
      for (let col = 0; col < cols; col++) {
        const px = x - 40 + offset + col * 20;
        const py = y + 20 - row * 12;
        particles.push({ id: generateId(), type: 'brick', x: px, y: py, progress: 0, maxProgress: 60, delay: row * 5 + col * 2, alpha: 0, size: 18, row, col, color: DEFAULT_COLORS[(row + col) % 3] });
      }
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WallParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WallParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - 5, p.size, 10);
    ctx.strokeStyle = '#553311';
    ctx.lineWidth = 1;
    ctx.strokeRect(p.x - p.size / 2, p.y - 5, p.size, 10);
    ctx.restore();
  },
};
