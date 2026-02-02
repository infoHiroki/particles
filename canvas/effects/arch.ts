/**
 * Arch エフェクト
 * アーチ + 弓形 + 門
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aa8866', '#cc9977', '#ddaa88'];
interface ArchParticle extends Particle { type: 'stone'; size: number; angle: number; color: string; }
export const archEffect: Effect = {
  config: { name: 'arch', description: 'アーチ + 弓形', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ArchParticle[] = [];
    const stoneCount = Math.floor(9 * intensity);
    for (let i = 0; i < stoneCount; i++) {
      const angle = Math.PI + (i / (stoneCount - 1)) * Math.PI;
      particles.push({ id: generateId(), type: 'stone', x, y, progress: 0, maxProgress: 60, delay: i * 3, alpha: 0, size: 35, angle, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ArchParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ArchParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const px = p.x + Math.cos(p.angle) * p.size;
    const py = p.y + Math.sin(p.angle) * p.size;
    ctx.translate(px, py);
    ctx.rotate(p.angle + Math.PI / 2);
    ctx.fillStyle = p.color;
    ctx.fillRect(-8, -5, 16, 10);
    ctx.strokeStyle = '#886644';
    ctx.lineWidth = 1;
    ctx.strokeRect(-8, -5, 16, 10);
    ctx.restore();
  },
};
