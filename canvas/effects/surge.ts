/**
 * Surge エフェクト
 * サージ + 高波 + 押し寄せ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#2266aa', '#4488cc', '#66aaee'];
interface SurgeParticle extends Particle { type: 'wave'; size: number; vx: number; height: number; color: string; }
export const surgeEffect: Effect = {
  config: { name: 'surge', description: 'サージ + 高波', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SurgeParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'wave', x: x - 80, y, progress: 0, maxProgress: 50, delay: i * 10, alpha: 0, size: 60 + i * 20, vx: random(4, 6), height: random(30, 50), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SurgeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.height *= 0.98;
    p.alpha = Math.sin(t * Math.PI) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SurgeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.quadraticCurveTo(p.x + p.size * 0.3, p.y - p.height, p.x + p.size * 0.5, p.y - p.height * 0.8);
    ctx.quadraticCurveTo(p.x + p.size * 0.7, p.y - p.height * 0.5, p.x + p.size, p.y);
    ctx.lineTo(p.x + p.size, p.y + 10);
    ctx.lineTo(p.x, p.y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(p.x + p.size * 0.4, p.y - p.height * 0.7, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
