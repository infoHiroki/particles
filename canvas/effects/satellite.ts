/**
 * Satellite エフェクト
 * 人工衛星 + 周回 + 軌道
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aaaacc', '#ccccee', '#8888aa'];
interface SatelliteParticle extends Particle { type: 'body' | 'panel' | 'signal'; angle: number; dist: number; speed: number; size: number; color: string; }
export const satelliteEffect: Effect = {
  config: { name: 'satellite', description: '人工衛星 + 周回', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SatelliteParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 30 + i * 15;
      particles.push({ id: generateId(), type: 'body', x, y, progress: 0, maxProgress: 100, delay: 0, alpha: 0, angle, dist, speed: 0.02 + i * 0.005, size: 6, color: DEFAULT_COLORS[0] });
      particles.push({ id: generateId(), type: 'panel', x, y, progress: 0, maxProgress: 100, delay: 0, alpha: 0, angle, dist, speed: 0.02 + i * 0.005, size: 10, color: '#4466aa' });
    }
    const signalCount = Math.floor(5 * intensity);
    for (let i = 0; i < signalCount; i++) {
      particles.push({ id: generateId(), type: 'signal', x, y, progress: 0, maxProgress: 40, delay: i * 15, alpha: 0, angle: 0, dist: 0, speed: 0, size: 5, color: '#66ff66' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SatelliteParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'signal') {
      p.size = 5 + t * 30;
      p.alpha = (1 - t) * 0.5;
    } else {
      p.angle += p.speed;
      p.alpha = Math.sin(t * Math.PI);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SatelliteParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'signal') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const px = p.x + Math.cos(p.angle) * p.dist;
      const py = p.y + Math.sin(p.angle) * (p.dist * 0.4);
      if (p.type === 'body') {
        ctx.fillStyle = p.color;
        ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(px - p.size, py - 2, p.size * 2, 4);
      }
    }
    ctx.restore();
  },
};
