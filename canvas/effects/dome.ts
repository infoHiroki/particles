/**
 * Dome エフェクト
 * ドーム + 曲面 + 天井
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#dddddd', '#cccccc', '#eeeeee'];
interface DomeParticle extends Particle { type: 'shell' | 'ring' | 'top'; size: number; level: number; color: string; }
export const domeEffect: Effect = {
  config: { name: 'dome', description: 'ドーム + 曲面', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DomeParticle[] = [];
    particles.push({ id: generateId(), type: 'shell', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 40, level: 0, color: DEFAULT_COLORS[0] });
    const ringCount = Math.floor(4 * intensity);
    for (let i = 0; i < ringCount; i++) {
      particles.push({ id: generateId(), type: 'ring', x, y: y - 5 - i * 8, progress: 0, maxProgress: 60, delay: 5 + i * 5, alpha: 0, size: 35 - i * 7, level: i, color: DEFAULT_COLORS[1] });
    }
    particles.push({ id: generateId(), type: 'top', x, y: y - 35, progress: 0, maxProgress: 60, delay: 25, alpha: 0, size: 8, level: 0, color: '#ffcc00' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DomeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DomeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'shell') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.2, 0, 0, Math.PI * 2);
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
