/**
 * Orbit2 エフェクト
 * 軌道 + 周回 + 惑星
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa44', '#44aaff', '#aa44ff'];
interface Orbit2Particle extends Particle { type: 'center' | 'orbiter'; size: number; angle: number; dist: number; speed: number; tilt: number; color: string; }
export const orbit2Effect: Effect = {
  config: { name: 'orbit2', description: '軌道 + 周回', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Orbit2Particle[] = [];
    particles.push({ id: generateId(), type: 'center', x, y, progress: 0, maxProgress: 70, alpha: 0, size: 12, angle: 0, dist: 0, speed: 0, tilt: 1, color: '#ffdd44' });
    const orbiterCount = Math.floor(5 * intensity);
    for (let i = 0; i < orbiterCount; i++) {
      particles.push({ id: generateId(), type: 'orbiter', x, y, progress: 0, maxProgress: 65, delay: i * 5, alpha: 0, size: random(4, 8), angle: random(0, Math.PI * 2), dist: 25 + i * 10, speed: 0.05 + random(0, 0.03), tilt: 0.3 + random(0, 0.4), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Orbit2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'orbiter') {
      p.angle += p.speed;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Orbit2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'center') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const ox = p.x + Math.cos(p.angle) * p.dist;
      const oy = p.y + Math.sin(p.angle) * p.dist * p.tilt;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(ox, oy, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.color + '44';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.dist, p.dist * p.tilt, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
