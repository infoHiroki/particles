/**
 * Slow エフェクト
 * スロー + 時計 + 波紋
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#4488ff', '#6699ff', '#88aaff'];

interface SlowParticle extends Particle {
  type: 'clock' | 'ripple' | 'particle';
  size: number;
  currentX: number;
  currentY: number;
  angle: number;
  color: string;
}

export const slowEffect: Effect = {
  config: { name: 'slow', description: 'スロー + 時計', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SlowParticle[] = [];

    // Clock
    particles.push({
      id: generateId(), type: 'clock', x, y, progress: 0, maxProgress: 60,
      alpha: 0, size: 30, currentX: x, currentY: y, angle: 0, color: DEFAULT_COLORS[0],
    });

    // Ripples
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(), type: 'ripple', x, y, progress: 0, maxProgress: 50,
        delay: i * 12, alpha: 0, size: 20, currentX: x, currentY: y, angle: 0,
        color: DEFAULT_COLORS[i % 3],
      });
    }

    // Floating particles
    const count = Math.floor(10 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({
        id: generateId(), type: 'particle', x, y, progress: 0, maxProgress: 55,
        delay: random(0, 25), alpha: 0, size: random(2, 4),
        currentX: x + random(-40, 40), currentY: y + random(-40, 40),
        angle: random(0, Math.PI * 2), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SlowParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'clock') {
      p.angle += 0.03;
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
    } else if (p.type === 'ripple') {
      p.size = 20 + t * 40;
      p.alpha = (1 - t) * 0.5;
    } else {
      p.angle += 0.02;
      p.currentX += Math.cos(p.angle) * 0.3;
      p.currentY += Math.sin(p.angle) * 0.3;
      p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SlowParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'clock') {
      // Clock face
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();

      // Clock hands
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle - Math.PI / 2) * p.size * 0.6,
                 p.y + Math.sin(p.angle - Math.PI / 2) * p.size * 0.6);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle * 0.1 - Math.PI / 2) * p.size * 0.4,
                 p.y + Math.sin(p.angle * 0.1 - Math.PI / 2) * p.size * 0.4);
      ctx.stroke();
    } else if (p.type === 'ripple') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
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
