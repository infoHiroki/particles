/**
 * Morph エフェクト
 * 変形 + 流動 + アメーバ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ddff', '#ff88dd', '#ddff88'];
interface MorphParticle extends Particle { type: 'blob'; size: number; points: number[]; morphSpeed: number; color: string; }
export const morphEffect: Effect = {
  config: { name: 'morph', description: '変形 + アメーバ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MorphParticle[] = [];
    const count = Math.floor(4 * intensity);
    for (let i = 0; i < count; i++) {
      const points: number[] = [];
      for (let j = 0; j < 8; j++) {
        points.push(random(0.7, 1.3));
      }
      particles.push({ id: generateId(), type: 'blob', x: x + random(-30, 30), y: y + random(-30, 30), progress: 0, maxProgress: 65, delay: i * 8, alpha: 0, size: random(20, 35), points, morphSpeed: random(0.03, 0.06), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MorphParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    for (let i = 0; i < p.points.length; i++) {
      p.points[i] += Math.sin(p.progress * p.morphSpeed + i) * 0.02;
      p.points[i] = Math.max(0.5, Math.min(1.5, p.points[i]));
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MorphParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.fillStyle = p.color + 'aa';
    ctx.beginPath();
    for (let i = 0; i <= p.points.length; i++) {
      const idx = i % p.points.length;
      const angle = (idx / p.points.length) * Math.PI * 2;
      const r = p.size * p.points[idx];
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else {
        const prevIdx = (i - 1) % p.points.length;
        const prevAngle = (prevIdx / p.points.length) * Math.PI * 2;
        const prevR = p.size * p.points[prevIdx];
        const cpAngle = (angle + prevAngle) / 2;
        const cpR = (r + prevR) / 2 * 1.1;
        ctx.quadraticCurveTo(Math.cos(cpAngle) * cpR, Math.sin(cpAngle) * cpR, px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
