/**
 * Grief エフェクト
 * グリーフ + 悲嘆 + 哀悼
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#334455', '#445566', '#556677'];
interface GriefParticle extends Particle { type: 'tear'; size: number; vy: number; wobble: number; color: string; }
export const griefEffect: Effect = {
  config: { name: 'grief', description: 'グリーフ + 悲嘆', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GriefParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'tear', x: x + random(-40, 40), y, progress: 0, maxProgress: 70, delay: random(0, 25), alpha: 0, size: random(3, 7), vy: random(0.8, 1.5), wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GriefParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.vy += 0.03;
    p.wobble += 0.08;
    p.x += Math.sin(p.wobble) * 0.2;
    p.alpha = Math.sin(t * Math.PI) * 0.5;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GriefParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - p.size);
    ctx.quadraticCurveTo(p.x + p.size, p.y, p.x, p.y + p.size);
    ctx.quadraticCurveTo(p.x - p.size, p.y, p.x, p.y - p.size);
    ctx.fill();
    ctx.restore();
  },
};
