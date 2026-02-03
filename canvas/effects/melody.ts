/**
 * Melody エフェクト
 * メロディ + 旋律 + 音符
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa00', '#ffcc33', '#ffee66'];
interface MelodyParticle extends Particle { type: 'note'; size: number; vx: number; vy: number; wobble: number; color: string; }
export const melodyEffect: Effect = {
  config: { name: 'melody', description: 'メロディ + 旋律', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MelodyParticle[] = [];
    const count = Math.floor(12 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'note', x, y, progress: 0, maxProgress: 55, delay: i * 4, alpha: 0, size: random(8, 14), vx: random(-1, 1), vy: random(-2, -1), wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MelodyParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.wobble += 0.1;
    p.x += Math.sin(p.wobble) * 0.5;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MelodyParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size, p.size * 0.7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.x + p.size * 0.8, p.y);
    ctx.lineTo(p.x + p.size * 0.8, p.y - p.size * 2);
    ctx.stroke();
    ctx.restore();
  },
};
