/**
 * Glow2 エフェクト
 * グロー + 発光 + 光彩
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffff88', '#ffdd66', '#ffcc44'];
interface Glow2Particle extends Particle { type: 'glow'; size: number; pulsePhase: number; color: string; }
export const glow2Effect: Effect = {
  config: { name: 'glow2', description: 'グロー + 発光', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Glow2Particle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'glow', x: x + random(-15, 15), y: y + random(-15, 15), progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: random(20, 35), pulsePhase: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Glow2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.pulsePhase += 0.15;
    p.alpha = Math.sin(t * Math.PI) * (0.5 + Math.sin(p.pulsePhase) * 0.2);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Glow2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grad.addColorStop(0, p.color);
    grad.addColorStop(0.5, p.color + '88');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
