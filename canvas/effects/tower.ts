/**
 * Tower エフェクト
 * 塔 + 高さ + 建築
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#888888', '#666666', '#aaaaaa'];
interface TowerParticle extends Particle { type: 'block' | 'light'; size: number; level: number; color: string; }
export const towerEffect: Effect = {
  config: { name: 'tower', description: '塔 + 高さ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TowerParticle[] = [];
    const levels = Math.floor(6 * intensity);
    for (let i = 0; i < levels; i++) {
      const width = 30 - i * 3;
      particles.push({ id: generateId(), type: 'block', x, y: y + 30 - i * 15, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: width, level: i, color: DEFAULT_COLORS[i % 3] });
    }
    particles.push({ id: generateId(), type: 'light', x, y: y + 30 - levels * 15, progress: 0, maxProgress: 60, delay: levels * 5, alpha: 0, size: 5, level: levels, color: '#ffff00' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TowerParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TowerParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'block') {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - 10, p.size, 15);
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y - 5, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
