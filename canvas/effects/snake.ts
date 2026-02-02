/**
 * Snake エフェクト
 * 蛇 + 蛇行 + 鱗
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aa44', '#338833', '#226622'];
interface SnakeParticle extends Particle { type: 'segment' | 'scale'; size: number; index: number; baseX: number; baseY: number; phase: number; color: string; }
export const snakeEffect: Effect = {
  config: { name: 'snake', description: '蛇 + 蛇行', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SnakeParticle[] = [];
    const segmentCount = Math.floor(8 * intensity);
    for (let i = 0; i < segmentCount; i++) {
      particles.push({ id: generateId(), type: 'segment', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 10 - i * 0.5, index: i, baseX: x, baseY: y, phase: 0, color: DEFAULT_COLORS[i % 3] });
    }
    for (let i = 0; i < 5; i++) {
      particles.push({ id: generateId(), type: 'scale', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 45, delay: random(10, 30), alpha: 0, size: random(3, 5), index: 0, baseX: x, baseY: y, phase: 0, color: '#55cc55' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SnakeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'segment') {
      p.phase = p.progress * 0.15;
      const offset = p.index * 0.5;
      p.x = p.baseX + Math.sin(p.phase - offset) * 25 + p.progress * 0.5;
      p.y = p.baseY + p.index * 8 - p.progress * 0.8;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SnakeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'segment') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      if (p.index === 0) {
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.2, p.size * 0.2, 0, Math.PI * 2);
        ctx.arc(p.x + p.size * 0.3, p.y - p.size * 0.2, p.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.2, p.size * 0.1, 0, Math.PI * 2);
        ctx.arc(p.x + p.size * 0.3, p.y - p.size * 0.2, p.size * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.lineTo(p.x + p.size * 0.7, p.y + p.size * 0.5);
      ctx.lineTo(p.x - p.size * 0.7, p.y + p.size * 0.5);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },
};
