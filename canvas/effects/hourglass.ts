/**
 * Hourglass エフェクト
 * 砂時計 + 砂 + 流れ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ddcc88', '#ccbb77', '#aa9966'];
interface HourglassParticle extends Particle { type: 'frame' | 'sand'; size: number; vy: number; color: string; }
export const hourglassEffect: Effect = {
  config: { name: 'hourglass', description: '砂時計 + 砂', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HourglassParticle[] = [];
    particles.push({ id: generateId(), type: 'frame', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 30, vy: 0, color: '#888888' });
    const sandCount = Math.floor(30 * intensity);
    for (let i = 0; i < sandCount; i++) {
      particles.push({ id: generateId(), type: 'sand', x: x + random(-2, 2), y: y - 10, progress: 0, maxProgress: 50, delay: i * 2, alpha: 0, size: random(2, 3), vy: random(1, 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HourglassParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'sand') {
      p.y += p.vy;
    }
    p.alpha = p.type === 'frame' ? Math.sin(t * Math.PI) : 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HourglassParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'frame') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size / 2, p.y - p.size);
      ctx.lineTo(p.x + p.size / 2, p.y - p.size);
      ctx.lineTo(p.x + 5, p.y);
      ctx.lineTo(p.x + p.size / 2, p.y + p.size);
      ctx.lineTo(p.x - p.size / 2, p.y + p.size);
      ctx.lineTo(p.x - 5, p.y);
      ctx.closePath();
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
