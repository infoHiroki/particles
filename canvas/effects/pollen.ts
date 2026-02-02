/**
 * Pollen エフェクト
 * 花粉 + 漂い + 光
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffee88', '#ffdd66', '#ffcc44'];

interface PollenParticle extends Particle {
  type: 'pollen' | 'glow';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  phase: number;
  color: string;
}

export const pollenEffect: Effect = {
  config: { name: 'pollen', description: '花粉 + 漂い', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PollenParticle[] = [];

    // Pollen particles
    const pollenCount = Math.floor(30 * intensity);
    for (let i = 0; i < pollenCount; i++) {
      particles.push({
        id: generateId(), type: 'pollen', x, y, progress: 0,
        maxProgress: 80 + random(0, 40), delay: random(0, 30), alpha: 0,
        size: random(2, 4), currentX: x + random(-80, 80), currentY: y + random(-60, 60),
        vx: random(-0.5, 0.5), vy: -random(0.3, 0.8), phase: random(0, Math.PI * 2),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Glow spots
    const glowCount = Math.floor(10 * intensity);
    for (let i = 0; i < glowCount; i++) {
      particles.push({
        id: generateId(), type: 'glow', x, y, progress: 0,
        maxProgress: 60 + random(0, 30), delay: random(0, 40), alpha: 0,
        size: random(8, 15), currentX: x + random(-70, 70), currentY: y + random(-50, 50),
        vx: random(-0.3, 0.3), vy: -random(0.2, 0.5), phase: random(0, Math.PI * 2),
        color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PollenParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    p.currentX += p.vx + Math.sin(p.progress * 0.05 + p.phase) * 0.3;
    p.currentY += p.vy;
    p.phase += 0.05;

    if (p.type === 'pollen') {
      p.alpha = t < 0.15 ? t / 0.15 : (1 - t) / 0.85 * 0.8;
    } else {
      p.alpha = Math.abs(Math.sin(p.phase)) * (1 - t) * 0.4;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PollenParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'pollen') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const g = ctx.createRadialGradient(p.currentX, p.currentY, 0, p.currentX, p.currentY, p.size);
      g.addColorStop(0, p.color + '80');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
