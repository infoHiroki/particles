/**
 * School エフェクト
 * 魚群 + 群泳 + スクール
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aadd', '#55bbee', '#66ccff'];
interface SchoolParticle extends Particle { type: 'fish'; size: number; vx: number; vy: number; tailPhase: number; color: string; }
export const schoolEffect: Effect = {
  config: { name: 'school', description: '魚群 + 群泳', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SchoolParticle[] = [];
    const count = Math.floor(15 * intensity);
    const baseAngle = random(0, Math.PI * 2);
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + random(-0.4, 0.4);
      const speed = random(1.5, 2.5);
      particles.push({ id: generateId(), type: 'fish', x: x + random(-50, 50), y: y + random(-30, 30), progress: 0, maxProgress: 55, delay: random(0, 10), alpha: 0, size: random(5, 10), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, tailPhase: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SchoolParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy + Math.sin(p.progress * 0.1) * 0.3;
    p.tailPhase += 0.4;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SchoolParticle;
    const angle = Math.atan2(p.vy, p.vx);
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(angle);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    const tailOffset = Math.sin(p.tailPhase) * 2;
    ctx.beginPath();
    ctx.moveTo(-p.size, 0);
    ctx.lineTo(-p.size - p.size * 0.5, tailOffset - p.size * 0.3);
    ctx.lineTo(-p.size - p.size * 0.5, tailOffset + p.size * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
