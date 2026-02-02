/**
 * Cascade エフェクト
 * カスケード + 連鎖 + 波及
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44ddff', '#44ffdd', '#ddff44'];
interface CascadeParticle extends Particle { type: 'drop'; size: number; row: number; col: number; baseY: number; color: string; }
export const cascadeEffect: Effect = {
  config: { name: 'cascade', description: 'カスケード + 連鎖', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CascadeParticle[] = [];
    const rows = Math.floor(5 * intensity);
    const cols = 7;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = x + (col - 3) * 15;
        const py = y + row * 12;
        particles.push({ id: generateId(), type: 'drop', x: px, y: py, progress: 0, maxProgress: 50, delay: row * 5 + col * 2, alpha: 0, size: random(4, 7), row, col, baseY: py, color: DEFAULT_COLORS[(row + col) % 3] });
      }
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CascadeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const bounce = Math.sin(t * Math.PI * 2) * 5 * (1 - t);
    p.y = p.baseY - bounce;
    p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CascadeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
