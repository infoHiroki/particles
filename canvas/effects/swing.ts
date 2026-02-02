/**
 * Swing エフェクト
 * スイング + 揺れ + 振り子
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aa88', '#55bb99', '#66ccaa'];
interface SwingParticle extends Particle { type: 'pendulum'; size: number; angle: number; swingSpeed: number; length: number; color: string; }
export const swingEffect: Effect = {
  config: { name: 'swing', description: 'スイング + 揺れ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SwingParticle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'pendulum', x: x + (i - count / 2) * 20, y: y - 30, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: random(8, 12), angle: random(-0.5, 0.5), swingSpeed: random(0.08, 0.12), length: random(30, 50), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SwingParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle = Math.sin(p.progress * p.swingSpeed) * 0.8 * (1 - t);
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SwingParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const endX = p.x + Math.sin(p.angle) * p.length;
    const endY = p.y + Math.cos(p.angle) * p.length;
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(endX, endY, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
