/**
 * Zoom3 エフェクト
 * ズーム + 拡大 + 焦点
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#cccccc', '#999999'];
interface Zoom3Particle extends Particle { type: 'line'; size: number; angle: number; speed: number; dist: number; color: string; }
export const zoom3Effect: Effect = {
  config: { name: 'zoom3', description: 'ズーム + 拡大', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Zoom3Particle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({ id: generateId(), type: 'line', x, y, progress: 0, maxProgress: 40, delay: random(0, 10), alpha: 0, size: random(10, 30), angle, speed: random(2, 5), dist: random(5, 15), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Zoom3Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.dist += p.speed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Zoom3Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    const startX = p.x + Math.cos(p.angle) * p.dist;
    const startY = p.y + Math.sin(p.angle) * p.dist;
    const endX = p.x + Math.cos(p.angle) * (p.dist + p.size);
    const endY = p.y + Math.sin(p.angle) * (p.dist + p.size);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();
  },
};
