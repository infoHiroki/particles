/**
 * Schedule エフェクト
 * スケジュール + 予定 + リスト
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#44ff44', '#4488ff'];
interface ScheduleParticle extends Particle { type: 'paper' | 'line' | 'check'; size: number; row: number; color: string; }
export const scheduleEffect: Effect = {
  config: { name: 'schedule', description: 'スケジュール + 予定', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ScheduleParticle[] = [];
    particles.push({ id: generateId(), type: 'paper', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 40, row: 0, color: DEFAULT_COLORS[0] });
    const lineCount = Math.floor(4 * intensity);
    for (let i = 0; i < lineCount; i++) {
      particles.push({ id: generateId(), type: 'line', x, y: y - 20 + i * 12, progress: 0, maxProgress: 70, delay: 10 + i * 5, alpha: 0, size: 30, row: i, color: DEFAULT_COLORS[2] });
      particles.push({ id: generateId(), type: 'check', x: x - 20, y: y - 20 + i * 12, progress: 0, maxProgress: 70, delay: 20 + i * 5, alpha: 0, size: 8, row: i, color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ScheduleParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ScheduleParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'paper') {
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size * 0.8, p.size, p.size * 1.6);
      ctx.strokeRect(p.x - p.size / 2, p.y - p.size * 0.8, p.size, p.size * 1.6);
    } else if (p.type === 'line') {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2 + 15, p.y - 2, p.size - 15, 4);
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x - 3, p.y);
      ctx.lineTo(p.x, p.y + 3);
      ctx.lineTo(p.x + 5, p.y - 3);
      ctx.stroke();
    }
    ctx.restore();
  },
};
