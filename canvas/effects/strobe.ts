/**
 * Strobe エフェクト
 * ストロボ + 点滅 + フラッシュ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ffdddd', '#ddddff'];
interface StrobeParticle extends Particle { type: 'flash'; size: number; flashState: number; color: string; }
export const strobeEffect: Effect = {
  config: { name: 'strobe', description: 'ストロボ + 点滅', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: StrobeParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'flash', x: x + random(-40, 40), y: y + random(-40, 40), progress: 0, maxProgress: 50, delay: i * 3, alpha: 0, size: random(40, 60), flashState: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StrobeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.flashState = Math.floor(p.progress / 3) % 2;
    p.alpha = p.flashState === 0 ? 0.9 : 0;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StrobeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    ctx.restore();
  },
};
