/**
 * Calm エフェクト
 * 穏やか + 波紋 + 静寂
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#88ddcc', '#66ccbb', '#44bbaa'];

interface CalmParticle extends Particle {
  type: 'ripple' | 'float' | 'glow';
  size: number;
  currentX: number;
  currentY: number;
  phase: number;
  color: string;
}

export const calmEffect: Effect = {
  config: { name: 'calm', description: '穏やか + 波紋', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CalmParticle[] = [];

    // Gentle ripples
    for (let i = 0; i < 4; i++) {
      particles.push({
        id: generateId(), type: 'ripple', x, y, progress: 0, maxProgress: 80,
        delay: i * 15, alpha: 0, size: 15, currentX: x, currentY: y,
        phase: 0, color: DEFAULT_COLORS[i % 3],
      });
    }

    // Central glow
    particles.push({
      id: generateId(), type: 'glow', x, y, progress: 0, maxProgress: 70,
      alpha: 0, size: 35, currentX: x, currentY: y, phase: 0, color: DEFAULT_COLORS[0],
    });

    // Floating particles
    const floatCount = Math.floor(12 * intensity);
    for (let i = 0; i < floatCount; i++) {
      particles.push({
        id: generateId(), type: 'float', x, y, progress: 0, maxProgress: 90,
        delay: random(0, 40), alpha: 0, size: random(2, 4),
        currentX: x + random(-50, 50), currentY: y + random(-40, 40),
        phase: random(0, Math.PI * 2), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CalmParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'ripple') {
      p.size = 15 + t * 60;
      p.alpha = (1 - t) * 0.4;
    } else if (p.type === 'glow') {
      p.phase += 0.05;
      p.size = 35 + Math.sin(p.phase) * 8;
      p.alpha = (t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1) * 0.5;
    } else {
      p.phase += 0.03;
      p.currentX += Math.sin(p.phase) * 0.3;
      p.currentY += Math.cos(p.phase * 0.7) * 0.2;
      p.alpha = (t < 0.2 ? t / 0.2 : (1 - t) / 0.8) * 0.6;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CalmParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'ripple') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'glow') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '88');
      g.addColorStop(0.6, p.color + '44');
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
