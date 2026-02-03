/**
 * Glass エフェクト
 * ガラス + 透明 + 屈折
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ccff', '#aaeeff', '#ffffff'];
interface GlassParticle extends Particle { type: 'shard'; size: number; rotation: number; vx: number; vy: number; color: string; }
export const glassEffect: Effect = {
  config: { name: 'glass', description: 'ガラス + 透明', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GlassParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(2, 5);
      particles.push({ id: generateId(), type: 'shard', x, y, progress: 0, maxProgress: 35, delay: 0, alpha: 0, size: random(4, 10), rotation: random(0, Math.PI), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GlassParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.rotation += 0.1;
    p.alpha = (1 - t) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GlassParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.lineTo(p.size * 0.6, p.size * 0.5);
    ctx.lineTo(-p.size * 0.6, p.size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
