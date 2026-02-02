/**
 * GPS エフェクト
 * GPS + 位置 + ナビ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4444', '#44ff44', '#4444ff'];
interface GpsParticle extends Particle { type: 'pin' | 'pulse' | 'satellite'; size: number; angle: number; dist: number; color: string; }
export const gpsEffect: Effect = {
  config: { name: 'gps', description: 'GPS + 位置', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GpsParticle[] = [];
    particles.push({ id: generateId(), type: 'pin', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 20, angle: 0, dist: 0, color: DEFAULT_COLORS[0] });
    for (let i = 0; i < 3; i++) {
      particles.push({ id: generateId(), type: 'pulse', x, y, progress: 0, maxProgress: 50, delay: i * 10, alpha: 0, size: 20 + i * 15, angle: 0, dist: 0, color: DEFAULT_COLORS[1] });
    }
    const satCount = Math.floor(3 * intensity);
    for (let i = 0; i < satCount; i++) {
      const a = (i / satCount) * Math.PI * 2 + random(-0.3, 0.3);
      particles.push({ id: generateId(), type: 'satellite', x, y, progress: 0, maxProgress: 55, delay: random(5, 20), alpha: 0, size: 4, angle: a, dist: random(40, 55), color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GpsParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'pulse') {
      p.size += 0.8;
    } else if (p.type === 'satellite') {
      p.angle += 0.03;
    }
    p.alpha = t < 0.15 ? t / 0.15 : (1 - t) * (p.type === 'pulse' ? 0.5 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GpsParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'pin') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y - p.size * 0.4, p.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + p.size * 0.5);
      ctx.lineTo(p.x - p.size * 0.35, p.y - p.size * 0.2);
      ctx.lineTo(p.x + p.size * 0.35, p.y - p.size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y - p.size * 0.4, p.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'pulse') {
      ctx.strokeStyle = p.color + '88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const sx = p.x + Math.cos(p.angle) * p.dist;
      const sy = p.y + Math.sin(p.angle) * p.dist;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.color + '44';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }
    ctx.restore();
  },
};
