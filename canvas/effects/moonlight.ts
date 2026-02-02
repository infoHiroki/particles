/**
 * Moonlight エフェクト
 * 月光 + 柔光 + 粒子
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#aabbdd', '#99aacc', '#8899bb'];

interface MoonlightParticle extends Particle {
  type: 'beam' | 'mote' | 'glow';
  size: number;
  currentX: number;
  currentY: number;
  vy: number;
  phase: number;
  color: string;
}

export const moonlightEffect: Effect = {
  config: { name: 'moonlight', description: '月光 + 柔光', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MoonlightParticle[] = [];

    // Light beam
    particles.push({
      id: generateId(), type: 'beam', x, y, progress: 0, maxProgress: 80,
      alpha: 0, size: 60, currentX: x, currentY: y, vy: 0, phase: 0,
      color: DEFAULT_COLORS[0],
    });

    // Central glow
    particles.push({
      id: generateId(), type: 'glow', x, y, progress: 0, maxProgress: 70,
      delay: 5, alpha: 0, size: 40, currentX: x, currentY: y, vy: 0, phase: 0,
      color: '#ffffff',
    });

    // Floating motes
    const moteCount = Math.floor(25 * intensity);
    for (let i = 0; i < moteCount; i++) {
      particles.push({
        id: generateId(), type: 'mote', x, y, progress: 0,
        maxProgress: 60 + random(0, 30), delay: random(0, 40), alpha: 0,
        size: random(1, 3), currentX: x + random(-50, 50), currentY: y + random(-80, 40),
        vy: random(0.3, 0.8), phase: random(0, Math.PI * 2),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MoonlightParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'beam') {
      p.alpha = (t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1) * 0.3;
    } else if (p.type === 'glow') {
      p.phase += 0.05;
      p.size = 40 + Math.sin(p.phase) * 5;
      p.alpha = (t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1) * 0.5;
    } else {
      p.currentY += p.vy;
      p.currentX += Math.sin(p.progress * 0.05 + p.phase) * 0.3;
      p.alpha = (t < 0.2 ? t / 0.2 : (1 - t) / 0.8) * 0.7;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MoonlightParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'beam') {
      const g = ctx.createLinearGradient(p.x, p.y - 100, p.x, p.y + 60);
      g.addColorStop(0, 'transparent');
      g.addColorStop(0.3, p.color + '40');
      g.addColorStop(0.6, p.color + '60');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;

      ctx.beginPath();
      ctx.moveTo(p.x - p.size * 0.3, p.y - 100);
      ctx.lineTo(p.x + p.size * 0.3, p.y - 100);
      ctx.lineTo(p.x + p.size, p.y + 60);
      ctx.lineTo(p.x - p.size, p.y + 60);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'glow') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + 'aa');
      g.addColorStop(0.5, p.color + '44');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
