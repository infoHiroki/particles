/**
 * Flood エフェクト
 * フラッド + 洪水 + 氾濫
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#335577', '#4477aa', '#5599cc'];
interface FloodParticle extends Particle { type: 'water'; size: number; vx: number; vy: number; wobble: number; color: string; }
export const floodEffect: Effect = {
  config: { name: 'flood', description: 'フラッド + 洪水', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FloodParticle[] = [];
    const count = Math.floor(40 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(-0.3, 0.3);
      particles.push({ id: generateId(), type: 'water', x: x - 60 + random(-20, 20), y: y + random(-20, 20), progress: 0, maxProgress: 45, delay: random(0, 10), alpha: 0, size: random(4, 10), vx: random(3, 6), vy: Math.sin(angle) * 2, wobble: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FloodParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.wobble += 0.2;
    p.y += p.vy + Math.sin(p.wobble) * 0.5;
    p.alpha = Math.sin(t * Math.PI) * 0.6;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FloodParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
