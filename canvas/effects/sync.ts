/**
 * Sync エフェクト
 * 同期 + シンク + 接続
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88aaff', '#aabbff', '#ccddff'];
interface SyncParticle extends Particle { type: 'wave'; size: number; phase: number; waveIndex: number; color: string; }
export const syncEffect: Effect = {
  config: { name: 'sync', description: '同期 + シンク', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SyncParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 50, delay: i * 5, alpha: 0, size: 10 + i * 12, phase: 0, waveIndex: i, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SyncParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.15;
    p.alpha = Math.sin(t * Math.PI) * (0.5 + Math.sin(p.phase) * 0.3);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SyncParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },
};
