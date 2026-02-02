/**
 * Spring エフェクト
 * バネ + 伸縮 + 弾性
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aaaaaa', '#888888', '#cccccc'];
interface SpringParticle extends Particle { type: 'coil'; size: number; stretch: number; phase: number; coils: number; color: string; }
export const springEffect: Effect = {
  config: { name: 'spring', description: 'バネ + 伸縮', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SpringParticle[] = [];
    const count = Math.floor(2 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'coil', x: x + (i - 0.5) * 40, y, progress: 0, maxProgress: 70, delay: i * 10, alpha: 0, size: 15, stretch: 1, phase: i * Math.PI, coils: 5 + i, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SpringParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.2;
    p.stretch = 1 + Math.sin(p.phase) * 0.5;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SpringParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    const height = 40 * p.stretch;
    for (let i = 0; i <= p.coils * 10; i++) {
      const t = i / (p.coils * 10);
      const px = p.x + Math.sin(t * p.coils * Math.PI * 2) * p.size;
      const py = p.y - height / 2 + t * height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  },
};
