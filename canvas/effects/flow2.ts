/**
 * Flow2 エフェクト
 * フロー2 + 流動 + 曲線
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#88ccff'];
interface Flow2Particle extends Particle { type: 'stream'; size: number; angle: number; speed: number; curve: number; color: string; }
export const flow2Effect: Effect = {
  config: { name: 'flow2', description: 'フロー2 + 流動', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Flow2Particle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'stream', x, y, progress: 0, maxProgress: 50, delay: i * 2, alpha: 0, size: random(3, 6), angle: random(0, Math.PI * 0.5), speed: random(2, 4), curve: random(-0.05, 0.05), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Flow2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.curve;
    p.x += Math.cos(p.angle) * p.speed;
    p.y += Math.sin(p.angle) * p.speed;
    p.alpha = Math.sin(t * Math.PI) * 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Flow2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
