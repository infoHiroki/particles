/**
 * Pillar エフェクト
 * 柱 + 支え + 神殿
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#dddddd', '#cccccc', '#eeeeee'];
interface PillarParticle extends Particle { type: 'column' | 'capital' | 'base'; size: number; offsetX: number; color: string; }
export const pillarEffect: Effect = {
  config: { name: 'pillar', description: '柱 + 支え', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PillarParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      const offsetX = (i - 1) * 35;
      particles.push({ id: generateId(), type: 'base', x: x + offsetX, y: y + 25, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 18, offsetX, color: DEFAULT_COLORS[2] });
      particles.push({ id: generateId(), type: 'column', x: x + offsetX, y, progress: 0, maxProgress: 60, delay: i * 5 + 3, alpha: 0, size: 50, offsetX, color: DEFAULT_COLORS[0] });
      particles.push({ id: generateId(), type: 'capital', x: x + offsetX, y: y - 30, progress: 0, maxProgress: 60, delay: i * 5 + 6, alpha: 0, size: 20, offsetX, color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PillarParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PillarParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'column') {
      ctx.fillRect(p.x - 8, p.y - p.size / 2, 16, p.size);
    } else if (p.type === 'capital') {
      ctx.fillRect(p.x - p.size / 2, p.y - 5, p.size, 10);
    } else {
      ctx.fillRect(p.x - p.size / 2, p.y - 5, p.size, 10);
    }
    ctx.restore();
  },
};
