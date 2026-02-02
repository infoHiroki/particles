/**
 * Radiance エフェクト
 * ラディアンス + 輝き + 光輝
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffff88', '#ffee66', '#ffdd44'];
interface RadianceParticle extends Particle { type: 'ray'; size: number; angle: number; length: number; color: string; }
export const radianceEffect: Effect = {
  config: { name: 'radiance', description: 'ラディアンス + 輝き', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RadianceParticle[] = [];
    const count = Math.floor(16 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'ray', x, y, progress: 0, maxProgress: 50, delay: i, alpha: 0, size: random(2, 4), angle, length: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RadianceParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.length = Math.sin(t * Math.PI) * 50;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RadianceParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.beginPath();
    ctx.moveTo(p.x + Math.cos(p.angle) * 10, p.y + Math.sin(p.angle) * 10);
    ctx.lineTo(p.x + Math.cos(p.angle) * (10 + p.length), p.y + Math.sin(p.angle) * (10 + p.length));
    ctx.stroke();
    ctx.restore();
  },
};
