/**
 * Twist エフェクト
 * ねじれ + 回転 + DNA風
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6699', '#6699ff', '#99ff66'];
interface TwistParticle extends Particle { type: 'node' | 'line'; size: number; yOffset: number; phase: number; side: number; color: string; }
export const twistEffect: Effect = {
  config: { name: 'twist', description: 'ねじれ + DNA風', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TwistParticle[] = [];
    const nodeCount = Math.floor(12 * intensity);
    for (let i = 0; i < nodeCount; i++) {
      const yOff = (i - nodeCount / 2) * 8;
      particles.push({ id: generateId(), type: 'node', x, y, progress: 0, maxProgress: 60, delay: Math.abs(i - nodeCount / 2) * 2, alpha: 0, size: 5, yOffset: yOff, phase: i * 0.5, side: 1, color: DEFAULT_COLORS[0] });
      particles.push({ id: generateId(), type: 'node', x, y, progress: 0, maxProgress: 60, delay: Math.abs(i - nodeCount / 2) * 2, alpha: 0, size: 5, yOffset: yOff, phase: i * 0.5 + Math.PI, side: -1, color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TwistParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.08;
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TwistParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const xOffset = Math.sin(p.phase) * 20;
    const px = p.x + xOffset;
    const py = p.y + p.yOffset;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
