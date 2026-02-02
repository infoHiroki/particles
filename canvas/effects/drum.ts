/**
 * Drum エフェクト
 * ドラム + ビート + 打撃
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6600', '#ffaa00', '#ff3300'];
interface DrumParticle extends Particle { type: 'hit' | 'wave'; size: number; maxSize: number; color: string; }
export const drumEffect: Effect = {
  config: { name: 'drum', description: 'ドラム + ビート', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DrumParticle[] = [];
    particles.push({ id: generateId(), type: 'hit', x, y, progress: 0, maxProgress: 20, delay: 0, alpha: 0, size: 5, maxSize: 30, color: '#ffffff' });
    const waveCount = Math.floor(4 * intensity);
    for (let i = 0; i < waveCount; i++) {
      particles.push({ id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 40, delay: i * 8, alpha: 0, size: 10, maxSize: 50 + i * 15, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DrumParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.size = p.maxSize * t;
    p.alpha = (1 - t) * (p.type === 'hit' ? 1 : 0.7);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DrumParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'hit') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
