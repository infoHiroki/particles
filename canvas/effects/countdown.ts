/**
 * Countdown エフェクト
 * カウントダウン + 数字 + 開始
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4444', '#ffaa44', '#44ff44'];
interface CountdownParticle extends Particle { type: 'number' | 'ring'; size: number; scale: number; value: number; color: string; }
export const countdownEffect: Effect = {
  config: { name: 'countdown', description: 'カウントダウン + 数字', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: CountdownParticle[] = [];
    for (let i = 3; i >= 1; i--) {
      particles.push({ id: generateId(), type: 'number', x, y, progress: 0, maxProgress: 25, delay: (3 - i) * 25, alpha: 0, size: 50, scale: 1, value: i, color: DEFAULT_COLORS[3 - i] });
      particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 25, delay: (3 - i) * 25, alpha: 0, size: 40, scale: 1, value: i, color: DEFAULT_COLORS[3 - i] });
    }
    particles.push({ id: generateId(), type: 'number', x, y, progress: 0, maxProgress: 30, delay: 75, alpha: 0, size: 40, scale: 1, value: 0, color: '#ffffff' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CountdownParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.scale = 1 + t * 0.5;
    if (p.type === 'ring') {
      p.size = 40 + t * 20;
    }
    p.alpha = 1 - t;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CountdownParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'number') {
      ctx.fillStyle = p.color;
      ctx.font = `bold ${p.size * p.scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.value === 0 ? 'GO!' : String(p.value), p.x, p.y);
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
