/**
 * Calendar エフェクト
 * カレンダー + 日付 + 予定
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ff4444', '#4488ff'];
interface CalendarParticle extends Particle { type: 'page' | 'mark' | 'flip'; size: number; rotation: number; day: number; color: string; }
export const calendarEffect: Effect = {
  config: { name: 'calendar', description: 'カレンダー + 日付', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: CalendarParticle[] = [];
    particles.push({ id: generateId(), type: 'page', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 40, rotation: 0, day: new Date().getDate(), color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'mark', x: x + 10, y: y - 5, progress: 0, maxProgress: 70, delay: 10, alpha: 0, size: 15, rotation: 0, day: 0, color: DEFAULT_COLORS[1] });
    const flipCount = 3;
    for (let i = 0; i < flipCount; i++) {
      particles.push({ id: generateId(), type: 'flip', x, y: y - 25, progress: 0, maxProgress: 30, delay: 20 + i * 10, alpha: 0, size: 35, rotation: 0, day: 0, color: DEFAULT_COLORS[0] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CalendarParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'flip') {
      p.rotation = t * Math.PI;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CalendarParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'page') {
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 2;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.strokeRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, 10);
      ctx.fillStyle = '#333333';
      ctx.font = `bold 20px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(p.day), p.x, p.y + 5);
    } else if (p.type === 'mark') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.translate(p.x, p.y);
      ctx.scale(1, Math.cos(p.rotation));
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -5, p.size, 10);
    }
    ctx.restore();
  },
};
