/**
 * Stopwatch エフェクト
 * ストップウォッチ + 計測 + 秒針
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#444444', '#ff4444', '#ffffff'];
interface StopwatchParticle extends Particle { type: 'face' | 'hand' | 'button'; size: number; angle: number; color: string; }
export const stopwatchEffect: Effect = {
  config: { name: 'stopwatch', description: 'ストップウォッチ + 計測', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: StopwatchParticle[] = [];
    particles.push({ id: generateId(), type: 'face', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 35, angle: 0, color: DEFAULT_COLORS[2] });
    particles.push({ id: generateId(), type: 'hand', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 25, angle: -Math.PI / 2, color: DEFAULT_COLORS[1] });
    particles.push({ id: generateId(), type: 'button', x, y: y - 40, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 8, angle: 0, color: DEFAULT_COLORS[0] });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StopwatchParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'hand') {
      p.angle = -Math.PI / 2 + t * Math.PI * 4;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StopwatchParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'face') {
      ctx.fillStyle = p.color;
      ctx.strokeStyle = DEFAULT_COLORS[0];
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const r = p.size - 5;
        ctx.fillStyle = DEFAULT_COLORS[0];
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(angle) * r, p.y + Math.sin(angle) * r, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (p.type === 'hand') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.size, p.y + Math.sin(p.angle) * p.size);
      ctx.stroke();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.restore();
  },
};
