/**
 * Void2 エフェクト
 * ボイド2 + 虚空 + 消滅
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#110011', '#220022', '#330033'];
interface Void2Particle extends Particle { type: 'hole'; size: number; shrink: number; color: string; }
export const void2Effect: Effect = {
  config: { name: 'void2', description: 'ボイド2 + 虚空', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: Void2Particle[] = [];
    particles.push({ id: generateId(), type: 'hole', x, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: 5, shrink: 0, color: '#000000' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Void2Particle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    if (t < 0.5) {
      p.size = 5 + t * 2 * 60;
    } else {
      p.size = 65 - (t - 0.5) * 2 * 60;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Void2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.7, '#110022');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
