/**
 * Rhythm エフェクト
 * リズム + 拍子 + 波形
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#9933ff', '#aa55ff', '#bb77ff'];
interface RhythmParticle extends Particle { type: 'bar'; width: number; height: number; targetHeight: number; index: number; color: string; }
export const rhythmEffect: Effect = {
  config: { name: 'rhythm', description: 'リズム + 拍子', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RhythmParticle[] = [];
    const count = Math.floor(10 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'bar', x: x - 50 + i * 10, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, width: 8, height: 5, targetHeight: random(20, 60), index: i, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RhythmParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    const beatT = (t * 4) % 1;
    p.height = 5 + p.targetHeight * Math.abs(Math.sin(beatT * Math.PI + p.index * 0.5));
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RhythmParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.width / 2, p.y - p.height / 2, p.width, p.height);
    ctx.restore();
  },
};
