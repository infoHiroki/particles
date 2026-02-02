/**
 * Cloud エフェクト
 * 雲 + ふわふわ + 空
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#eeeeee', '#dddddd'];
interface CloudParticle extends Particle { type: 'puff'; size: number; vx: number; offsetX: number; offsetY: number; color: string; }
export const cloudEffect: Effect = {
  config: { name: 'cloud', description: '雲 + ふわふわ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CloudParticle[] = [];
    const puffCount = Math.floor(7 * intensity);
    const offsets = [
      [0, 0], [-20, 5], [20, 5], [-10, -8], [10, -8], [-25, 10], [25, 10]
    ];
    for (let i = 0; i < puffCount; i++) {
      const [ox, oy] = offsets[i] || [random(-20, 20), random(-10, 10)];
      particles.push({ id: generateId(), type: 'puff', x, y, progress: 0, maxProgress: 65, delay: i * 2, alpha: 0, size: random(15, 25), vx: random(0.2, 0.5), offsetX: ox, offsetY: oy, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CloudParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 0.9;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CloudParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(p.x + p.offsetX, p.y + p.offsetY, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
