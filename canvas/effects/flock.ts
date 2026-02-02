/**
 * Flock エフェクト
 * 群れ + フロック + 集団飛行
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88aacc', '#99bbdd', '#aaccee'];
interface FlockParticle extends Particle { type: 'bird'; size: number; vx: number; vy: number; wingPhase: number; color: string; }
export const flockEffect: Effect = {
  config: { name: 'flock', description: '群れ + フロック', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FlockParticle[] = [];
    const count = Math.floor(12 * intensity);
    const baseAngle = random(-Math.PI / 4, Math.PI / 4);
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + random(-0.3, 0.3);
      const speed = random(2, 3);
      particles.push({ id: generateId(), type: 'bird', x: x + random(-40, 40), y: y + random(-30, 30), progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, size: random(4, 7), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, wingPhase: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FlockParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.wingPhase += 0.3;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FlockParticle;
    const wingOffset = Math.sin(p.wingPhase) * 3;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - p.size, p.y - wingOffset);
    ctx.lineTo(p.x - p.size / 2, p.y);
    ctx.lineTo(p.x - p.size, p.y + wingOffset);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
