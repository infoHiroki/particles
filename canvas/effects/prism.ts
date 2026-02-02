/**
 * Prism エフェクト
 * プリズム + 虹色分光 + 屈折
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'];
interface PrismParticle extends Particle { type: 'ray'; size: number; angle: number; length: number; color: string; }
export const prismEffect: Effect = {
  config: { name: 'prism', description: 'プリズム + 虹色分光', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PrismParticle[] = [];
    const count = Math.floor(12 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 0.5 - Math.PI * 0.25;
      particles.push({ id: generateId(), type: 'ray', x, y, progress: 0, maxProgress: 50, delay: i * 2, alpha: 0, size: random(2, 4), angle, length: 0, color: DEFAULT_COLORS[i % 6] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PrismParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.length = t * 60;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PrismParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + Math.cos(p.angle) * p.length, p.y + Math.sin(p.angle) * p.length);
    ctx.stroke();
    ctx.restore();
  },
};
