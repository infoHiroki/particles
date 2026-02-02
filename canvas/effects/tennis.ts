/**
 * Tennis エフェクト
 * テニス + ボール + エース
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ccff00', '#ffffff', '#ffff00'];
interface TennisParticle extends Particle { type: 'ball' | 'trail' | 'fuzz'; size: number; vx: number; vy: number; rotation: number; color: string; }
export const tennisEffect: Effect = {
  config: { name: 'tennis', description: 'テニス + エース', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TennisParticle[] = [];
    particles.push({ id: generateId(), type: 'ball', x, y, progress: 0, maxProgress: 45, alpha: 0, size: 12, vx: 5, vy: -1, rotation: 0, color: DEFAULT_COLORS[0] });
    const trailCount = Math.floor(6 * intensity);
    for (let i = 0; i < trailCount; i++) {
      particles.push({ id: generateId(), type: 'trail', x, y, progress: 0, maxProgress: 35, delay: i * 2, alpha: 0, size: 10 - i, vx: 5, vy: -1, rotation: 0, color: DEFAULT_COLORS[0] });
    }
    const fuzzCount = Math.floor(5 * intensity);
    for (let i = 0; i < fuzzCount; i++) {
      particles.push({ id: generateId(), type: 'fuzz', x, y, progress: 0, maxProgress: 30, delay: random(0, 10), alpha: 0, size: random(1, 2), vx: random(-1, 1), vy: random(-1, 1), rotation: 0, color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TennisParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'ball') {
      p.rotation += 0.4;
    } else if (p.type === 'fuzz') {
      p.vx *= 0.95;
      p.vy *= 0.95;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.7 ? (1 - t) / 0.3 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TennisParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.type === 'ball') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-p.size * 0.3, 0, p.size * 0.8, -0.6, 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.size * 0.3, 0, p.size * 0.8, Math.PI - 0.6, Math.PI + 0.6);
      ctx.stroke();
    } else if (p.type === 'trail') {
      ctx.fillStyle = p.color + '44';
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
