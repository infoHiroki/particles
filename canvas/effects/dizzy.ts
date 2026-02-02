/**
 * Dizzy エフェクト
 * めまい + 混乱 + グルグル
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffff00', '#ffcc00', '#ffee44'];
interface DizzyParticle extends Particle { type: 'star' | 'spiral'; size: number; angle: number; dist: number; speed: number; color: string; }
export const dizzyEffect: Effect = {
  config: { name: 'dizzy', description: 'めまい + 混乱', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DizzyParticle[] = [];
    const starCount = Math.floor(5 * intensity);
    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'star', x, y: y - 15, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: random(6, 10), angle, dist: 25, speed: 0.1, color: DEFAULT_COLORS[i % 3] });
    }
    particles.push({ id: generateId(), type: 'spiral', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 20, angle: 0, dist: 0, speed: 0.15, color: '#aaaaaa' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DizzyParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.speed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DizzyParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'star') {
      const px = p.x + Math.cos(p.angle) * p.dist;
      const py = p.y + Math.sin(p.angle) * (p.dist * 0.3);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? p.size : p.size * 0.4;
        if (i === 0) ctx.moveTo(px + Math.cos(a) * r, py + Math.sin(a) * r);
        else ctx.lineTo(px + Math.cos(a) * r, py + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const a = p.angle + t * Math.PI * 4;
        const r = t * p.size;
        const px = p.x + Math.cos(a) * r;
        const py = p.y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
  },
};
