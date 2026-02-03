/**
 * Interference エフェクト
 * 干渉 + インターフェア + 波紋重ね
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#88aaff', '#aaccff'];
interface InterferenceParticle extends Particle { type: 'wave'; size: number; centerX: number; centerY: number; expandSpeed: number; color: string; }
export const interferenceEffect: Effect = {
  config: { name: 'interference', description: '干渉 + インターフェア', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: InterferenceParticle[] = [];
    const centers = [
      {x: x - 25, y},
      {x: x + 25, y}
    ];
    const waveCount = Math.floor(5 * intensity);
    for (const center of centers) {
      for (let i = 0; i < waveCount; i++) {
        particles.push({ id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 50, delay: i * 6, alpha: 0, size: 5, centerX: center.x, centerY: center.y, expandSpeed: random(2, 3), color: DEFAULT_COLORS[i % 3] });
      }
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as InterferenceParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.size += p.expandSpeed;
    p.alpha = (1 - t) * 0.5;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as InterferenceParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(p.centerX, p.centerY, p.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },
};
