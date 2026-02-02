/**
 * Data エフェクト
 * データ + 情報 + 転送
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00aaff', '#0088cc', '#006699'];
interface DataParticle extends Particle { type: 'packet'; size: number; angle: number; dist: number; speed: number; color: string; }
export const dataEffect: Effect = {
  config: { name: 'data', description: 'データ + 情報', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DataParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({ id: generateId(), type: 'packet', x, y, progress: 0, maxProgress: 40, delay: i * 2, alpha: 0, size: random(3, 6), angle, dist: 0, speed: random(2, 4), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DataParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.dist += p.speed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DataParticle;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * p.dist;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size);
    ctx.restore();
  },
};
