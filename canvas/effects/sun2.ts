/**
 * Sun2 エフェクト
 * 太陽 + 日光 + 輝き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffdd00', '#ffaa00', '#ff8800'];
interface Sun2Particle extends Particle { type: 'core' | 'ray'; size: number; angle: number; rayLength: number; color: string; }
export const sun2Effect: Effect = {
  config: { name: 'sun2', description: '太陽 + 日光', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Sun2Particle[] = [];
    particles.push({ id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 20, angle: 0, rayLength: 0, color: DEFAULT_COLORS[0] });
    const rayCount = Math.floor(12 * intensity);
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'ray', x, y, progress: 0, maxProgress: 60, delay: 5, alpha: 0, size: 3, angle, rayLength: random(15, 25), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Sun2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'ray') {
      p.angle += 0.02;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Sun2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'core') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const startX = p.x + Math.cos(p.angle) * 22;
      const startY = p.y + Math.sin(p.angle) * 22;
      const endX = p.x + Math.cos(p.angle) * (22 + p.rayLength);
      const endY = p.y + Math.sin(p.angle) * (22 + p.rayLength);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    ctx.restore();
  },
};
