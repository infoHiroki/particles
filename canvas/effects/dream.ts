/**
 * Dream エフェクト
 * 夢 + 幻想 + ふわふわ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaaff', '#aaffff', '#ffffaa'];
interface DreamParticle extends Particle { type: 'cloud' | 'sparkle'; size: number; vx: number; vy: number; phase: number; color: string; }
export const dreamEffect: Effect = {
  config: { name: 'dream', description: '夢 + 幻想', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DreamParticle[] = [];
    const cloudCount = Math.floor(5 * intensity);
    for (let i = 0; i < cloudCount; i++) {
      particles.push({ id: generateId(), type: 'cloud', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 80, delay: random(0, 15), alpha: 0, size: random(15, 25), vx: random(-0.3, 0.3), vy: random(-0.3, -0.5), phase: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    const sparkleCount = Math.floor(8 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-40, 40), y: y + random(-30, 30), progress: 0, maxProgress: 60, delay: random(0, 20), alpha: 0, size: random(2, 4), vx: 0, vy: 0, phase: random(0, Math.PI * 2), color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DreamParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.05;
    if (p.type === 'cloud') {
      p.x += p.vx + Math.sin(p.phase) * 0.2;
      p.y += p.vy;
      p.alpha = Math.sin(t * Math.PI) * 0.4;
    } else {
      p.alpha = Math.sin(p.phase * 3) * 0.5 + 0.5;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DreamParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'cloud') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
