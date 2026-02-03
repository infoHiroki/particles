/**
 * Balance2 エフェクト
 * バランス2 + 均衡 + 対称
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aaff', '#44ffaa', '#ffaa44'];
interface Balance2Particle extends Particle { type: 'orb'; size: number; angle: number; dist: number; rotSpeed: number; mirror: boolean; color: string; }
export const balance2Effect: Effect = {
  config: { name: 'balance2', description: 'バランス2 + 均衡', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Balance2Particle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI;
      const dist = random(30, 50);
      particles.push({ id: generateId(), type: 'orb', x, y, progress: 0, maxProgress: 60, delay: i * 3, alpha: 0, size: random(6, 10), angle, dist, rotSpeed: 0.03, mirror: false, color: DEFAULT_COLORS[i % 3] });
      particles.push({ id: generateId(), type: 'orb', x, y, progress: 0, maxProgress: 60, delay: i * 3, alpha: 0, size: random(6, 10), angle: angle + Math.PI, dist, rotSpeed: 0.03, mirror: true, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Balance2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.rotSpeed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Balance2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * p.dist;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
