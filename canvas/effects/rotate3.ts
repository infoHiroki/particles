/**
 * Rotate3 エフェクト
 * 回転 + 転回 + スピン
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aa44ff', '#cc66ff', '#ffffff'];
interface Rotate3Particle extends Particle { type: 'shape' | 'trail'; size: number; rotation: number; rotSpeed: number; dist: number; color: string; }
export const rotate3Effect: Effect = {
  config: { name: 'rotate3', description: '回転 + 転回', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Rotate3Particle[] = [];
    particles.push({ id: generateId(), type: 'shape', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 30, rotation: 0, rotSpeed: 0.15, dist: 0, color: DEFAULT_COLORS[0] });
    const trailCount = Math.floor(12 * intensity);
    for (let i = 0; i < trailCount; i++) {
      const angle = (i / trailCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'trail', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: random(3, 6), rotation: angle, rotSpeed: 0.15, dist: 35, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Rotate3Particle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.rotation += p.rotSpeed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Rotate3Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'shape') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    } else {
      const px = p.x + Math.cos(p.rotation) * p.dist;
      const py = p.y + Math.sin(p.rotation) * p.dist;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
