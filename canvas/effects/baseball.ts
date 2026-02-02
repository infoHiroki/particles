/**
 * Baseball エフェクト
 * 野球 + ボール + ホームラン
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#cc0000', '#ffdd00'];
interface BaseballParticle extends Particle { type: 'ball' | 'trail' | 'spark'; size: number; vx: number; vy: number; rotation: number; color: string; }
export const baseballEffect: Effect = {
  config: { name: 'baseball', description: '野球 + ホームラン', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BaseballParticle[] = [];
    particles.push({ id: generateId(), type: 'ball', x, y, progress: 0, maxProgress: 55, alpha: 0, size: 14, vx: 4, vy: -3, rotation: 0, color: DEFAULT_COLORS[0] });
    const trailCount = Math.floor(8 * intensity);
    for (let i = 0; i < trailCount; i++) {
      particles.push({ id: generateId(), type: 'trail', x, y, progress: 0, maxProgress: 40, delay: i * 2, alpha: 0, size: 10 - i * 0.8, vx: 4, vy: -3, rotation: 0, color: '#ffffff' });
    }
    const sparkCount = Math.floor(6 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({ id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 35, delay: random(0, 5), alpha: 0, size: random(2, 4), vx: random(-2, 2), vy: random(-3, -1), rotation: 0, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BaseballParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'ball') {
      p.vy += 0.1;
      p.rotation += 0.3;
    } else if (p.type === 'spark') {
      p.vy += 0.08;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.7 ? (1 - t) / 0.3 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BaseballParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    if (p.type === 'ball') {
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cc0000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-p.size * 0.3, 0, p.size * 0.6, -0.8, 0.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.size * 0.3, 0, p.size * 0.6, Math.PI - 0.8, Math.PI + 0.8);
      ctx.stroke();
    } else if (p.type === 'trail') {
      ctx.fillStyle = p.color + '66';
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
