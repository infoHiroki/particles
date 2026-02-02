/**
 * Energy エフェクト
 * エネルギー + 力 + パワー
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ffff', '#44ffff', '#88ffff'];
interface EnergyParticle extends Particle { type: 'core' | 'arc'; size: number; angle: number; dist: number; color: string; }
export const energyEffect: Effect = {
  config: { name: 'energy', description: 'エネルギー + 力', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: EnergyParticle[] = [];
    particles.push({ id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 20, angle: 0, dist: 0, color: DEFAULT_COLORS[0] });
    const arcCount = Math.floor(12 * intensity);
    for (let i = 0; i < arcCount; i++) {
      particles.push({ id: generateId(), type: 'arc', x, y, progress: 0, maxProgress: 60, delay: random(0, 10), alpha: 0, size: random(15, 25), angle: random(0, Math.PI * 2), dist: random(25, 40), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as EnergyParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'arc') {
      p.angle += 0.1;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as EnergyParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'core') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const px = p.x + Math.cos(p.angle) * p.dist;
      const py = p.y + Math.sin(p.angle) * p.dist;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, p.size, p.angle, p.angle + Math.PI);
      ctx.stroke();
    }
    ctx.restore();
  },
};
