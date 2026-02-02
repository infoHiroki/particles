/**
 * Star2 エフェクト
 * 星 + 五芒星 + 輝き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffdd00', '#ffcc00', '#ffffff'];
interface Star2Particle extends Particle { type: 'star'; size: number; rotation: number; color: string; }
export const star2Effect: Effect = {
  config: { name: 'star2', description: '星 + 五芒星', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Star2Particle[] = [];
    const count = Math.floor(6 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'star', x: x + random(-30, 30), y: y + random(-30, 30), progress: 0, maxProgress: 50, delay: i * 5, alpha: 0, size: random(8, 15), rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Star2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.rotation += 0.05;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Star2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const innerAngle = angle + Math.PI / 5;
      ctx.lineTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size);
      ctx.lineTo(Math.cos(innerAngle) * p.size * 0.4, Math.sin(innerAngle) * p.size * 0.4);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
