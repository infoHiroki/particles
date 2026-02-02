/**
 * Strike エフェクト
 * ストライク + 打撃 + 一撃
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ffff88', '#ffdd44'];
interface StrikeParticle extends Particle { type: 'line' | 'spark'; size: number; angle: number; length: number; vx: number; vy: number; color: string; }
export const strikeEffect: Effect = {
  config: { name: 'strike', description: 'ストライク + 打撃', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: StrikeParticle[] = [];
    particles.push({ id: generateId(), type: 'line', x, y, progress: 0, maxProgress: 20, delay: 0, alpha: 0, size: 5, angle: -Math.PI / 4, length: 60, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    const sparkCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(-Math.PI / 2, 0);
      const speed = random(3, 6);
      particles.push({ id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 30, delay: 5, alpha: 0, size: random(2, 4), angle: 0, length: 0, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StrikeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'spark') {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
    }
    p.alpha = p.type === 'line' ? (1 - t) : (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StrikeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'line') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x - Math.cos(p.angle) * p.length / 2, p.y - Math.sin(p.angle) * p.length / 2);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.length / 2, p.y + Math.sin(p.angle) * p.length / 2);
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
