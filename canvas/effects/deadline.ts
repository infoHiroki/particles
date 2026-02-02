/**
 * Deadline エフェクト
 * 締め切り + 警告 + 急げ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0000', '#ff4444', '#ffaa00'];
interface DeadlineParticle extends Particle { type: 'warning' | 'flash' | 'text'; size: number; phase: number; color: string; }
export const deadlineEffect: Effect = {
  config: { name: 'deadline', description: '締め切り + 警告', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DeadlineParticle[] = [];
    particles.push({ id: generateId(), type: 'warning', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 35, phase: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'text', x, y: y + 30, progress: 0, maxProgress: 60, delay: 10, alpha: 0, size: 14, phase: 0, color: DEFAULT_COLORS[2] });
    const flashCount = Math.floor(4 * intensity);
    for (let i = 0; i < flashCount; i++) {
      particles.push({ id: generateId(), type: 'flash', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 45 + i * 10, phase: 0, color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DeadlineParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.3;
    if (p.type === 'flash') {
      p.alpha = Math.sin(p.phase * 2) > 0 ? 0.3 : 0;
    } else {
      p.alpha = Math.sin(t * Math.PI);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DeadlineParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'warning') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.lineTo(p.x + p.size * 0.9, p.y + p.size * 0.5);
      ctx.lineTo(p.x - p.size * 0.9, p.y + p.size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold 24px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', p.x, p.y);
    } else if (p.type === 'flash') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.font = `bold ${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('DEADLINE!', p.x, p.y);
    }
    ctx.restore();
  },
};
