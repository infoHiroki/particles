/**
 * Piston エフェクト
 * ピストン + 往復 + 圧縮
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#666666', '#888888', '#aaaaaa'];
interface PistonParticle extends Particle { type: 'piston' | 'rod'; size: number; phase: number; speed: number; color: string; }
export const pistonEffect: Effect = {
  config: { name: 'piston', description: 'ピストン + 往復', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PistonParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      const offsetX = (i - 1) * 30;
      particles.push({ id: generateId(), type: 'piston', x: x + offsetX, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 15, phase: (i / count) * Math.PI * 2, speed: 0.15, color: DEFAULT_COLORS[0] });
      particles.push({ id: generateId(), type: 'rod', x: x + offsetX, y: y + 20, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 8, phase: (i / count) * Math.PI * 2, speed: 0.15, color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PistonParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.phase += p.speed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PistonParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const offset = Math.sin(p.phase) * 15;
    ctx.fillStyle = p.color;
    if (p.type === 'piston') {
      ctx.fillRect(p.x - p.size, p.y - p.size * 0.5 + offset, p.size * 2, p.size);
    } else {
      ctx.fillRect(p.x - 3, p.y + offset, 6, 25);
    }
    ctx.restore();
  },
};
