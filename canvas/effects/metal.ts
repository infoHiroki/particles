/**
 * Metal エフェクト
 * メタル + 金属光沢 + 反射
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#c0c0c0', '#d4af37', '#b87333'];
interface MetalParticle extends Particle { type: 'flake'; size: number; shine: number; rotation: number; color: string; }
export const metalEffect: Effect = {
  config: { name: 'metal', description: 'メタル + 金属光沢', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MetalParticle[] = [];
    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(10, 50);
      particles.push({ id: generateId(), type: 'flake', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 40, delay: random(0, 10), alpha: 0, size: random(3, 8), shine: random(0.5, 1), rotation: random(0, Math.PI), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MetalParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.shine = 0.5 + Math.sin(t * Math.PI * 4) * 0.5;
    p.rotation += 0.05;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MetalParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha * p.shine;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  },
};
