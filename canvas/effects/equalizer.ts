/**
 * Equalizer エフェクト
 * イコライザー + 波形 + バー
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ff00', '#00cc00', '#00ff66'];
interface EqualizerParticle extends Particle { type: 'bar'; size: number; maxHeight: number; phase: number; barIndex: number; color: string; }
export const equalizerEffect: Effect = {
  config: { name: 'equalizer', description: 'イコライザー + 波形', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: EqualizerParticle[] = [];
    const barCount = Math.floor(10 * intensity);
    for (let i = 0; i < barCount; i++) {
      particles.push({ id: generateId(), type: 'bar', x: x - 45 + i * 10, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 8, maxHeight: random(20, 50), phase: random(0, Math.PI * 2), barIndex: i, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as EqualizerParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.15;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as EqualizerParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const height = (Math.sin(p.phase) * 0.5 + 0.5) * p.maxHeight;
    const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y - height);
    grad.addColorStop(0, '#00ff00');
    grad.addColorStop(0.6, '#ffff00');
    grad.addColorStop(1, '#ff0000');
    ctx.fillStyle = grad;
    ctx.fillRect(p.x - p.size / 2, p.y - height, p.size, height);
    ctx.restore();
  },
};
