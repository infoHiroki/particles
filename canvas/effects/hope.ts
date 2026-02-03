/**
 * Hope エフェクト
 * ホープ + 希望 + 光明
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffd700', '#ffec8b', '#fffacd'];
interface HopeParticle extends Particle { type: 'ray'; size: number; angle: number; length: number; pulse: number; color: string; }
export const hopeEffect: Effect = {
  config: { name: 'hope', description: 'ホープ + 希望', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HopeParticle[] = [];
    const rayCount = Math.floor(8 * intensity);
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'ray', x, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: random(2, 4), angle, length: 0, pulse: random(0, Math.PI), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HopeParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.pulse += 0.15;
    p.length = 30 + Math.sin(p.pulse) * 15 + t * 30;
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HopeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + Math.cos(p.angle) * p.length, p.y + Math.sin(p.angle) * p.length);
    ctx.stroke();
    ctx.restore();
  },
};
