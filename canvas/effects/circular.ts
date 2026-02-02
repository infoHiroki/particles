/**
 * Circular エフェクト
 * 円形タイマー + アーク + 進捗
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#44ff88', '#ff4488'];
interface CircularParticle extends Particle { type: 'track' | 'arc' | 'dot'; size: number; angle: number; color: string; }
export const circularEffect: Effect = {
  config: { name: 'circular', description: '円形タイマー + アーク', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: CircularParticle[] = [];
    particles.push({ id: generateId(), type: 'track', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 35, angle: 0, color: '#333333' });
    particles.push({ id: generateId(), type: 'arc', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 35, angle: -Math.PI / 2, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'dot', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 35, angle: -Math.PI / 2, color: DEFAULT_COLORS[1] });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CircularParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    if (p.type !== 'track') {
      p.angle = -Math.PI / 2 + t * Math.PI * 2;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CircularParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'track') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'arc') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, -Math.PI / 2, p.angle);
      ctx.stroke();
    } else {
      const px = p.x + Math.cos(p.angle) * p.size;
      const py = p.y + Math.sin(p.angle) * p.size;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
