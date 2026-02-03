/**
 * Split2 エフェクト
 * スプリット2 + 分断 + 裂開
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa00', '#ff6600', '#ff2200'];
interface Split2Particle extends Particle { type: 'fragment'; size: number; vx: number; vy: number; rotation: number; color: string; }
export const split2Effect: Effect = {
  config: { name: 'split2', description: 'スプリット2 + 分断', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Split2Particle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const isUp = i % 2 === 0;
      const angle = isUp ? random(-Math.PI * 0.8, -Math.PI * 0.2) : random(Math.PI * 0.2, Math.PI * 0.8);
      const speed = random(3, 6);
      particles.push({ id: generateId(), type: 'fragment', x, y, progress: 0, maxProgress: 40, delay: 0, alpha: 0, size: random(5, 12), vx: Math.cos(angle) * speed * 0.3, vy: Math.sin(angle) * speed, rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Split2Particle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vy *= 0.98;
    p.rotation += 0.1;
    p.alpha = (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Split2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  },
};
