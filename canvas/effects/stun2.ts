/**
 * Stun2 エフェクト
 * スタン + 気絶 + めまい
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffff00', '#ffdd00', '#ffbb00'];
interface Stun2Particle extends Particle { type: 'star'; size: number; angle: number; dist: number; rotSpeed: number; color: string; }
export const stun2Effect: Effect = {
  config: { name: 'stun2', description: 'スタン + 気絶', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Stun2Particle[] = [];
    const count = Math.floor(6 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'star', x, y: y - 20, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: random(6, 10), angle, dist: 25, rotSpeed: 0.08, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Stun2Particle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.rotSpeed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Stun2Particle;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * p.dist * 0.4;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(px, py);
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
