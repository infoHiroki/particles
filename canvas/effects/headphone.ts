/**
 * Headphone エフェクト
 * ヘッドホン + 音符 + 没入
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#333333', '#ff66aa', '#66aaff'];
interface HeadphoneParticle extends Particle { type: 'band' | 'cup' | 'note'; size: number; vx: number; vy: number; side: number; color: string; }
export const headphoneEffect: Effect = {
  config: { name: 'headphone', description: 'ヘッドホン + 音符', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HeadphoneParticle[] = [];
    particles.push({ id: generateId(), type: 'band', x, y: y - 15, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 30, vx: 0, vy: 0, side: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'cup', x: x - 30, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 15, vx: 0, vy: 0, side: -1, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'cup', x: x + 30, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 15, vx: 0, vy: 0, side: 1, color: DEFAULT_COLORS[0] });
    const noteCount = Math.floor(6 * intensity);
    for (let i = 0; i < noteCount; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      particles.push({ id: generateId(), type: 'note', x: x + side * 30, y, progress: 0, maxProgress: 50, delay: 10 + i * 8, alpha: 0, size: 10, vx: side * 0.5, vy: -1, side, color: DEFAULT_COLORS[1 + (i % 2)] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HeadphoneParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'note') {
      p.x += p.vx;
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HeadphoneParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'band') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y + 15, p.size, Math.PI, 0);
      ctx.stroke();
    } else if (p.type === 'cup') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.font = `${p.size * 2}px serif`;
      ctx.fillText('♪', p.x, p.y);
    }
    ctx.restore();
  },
};
