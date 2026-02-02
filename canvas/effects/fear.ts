/**
 * Fear エフェクト
 * 恐怖 + 震え + 暗闘
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#442266', '#332255', '#221144'];

interface FearParticle extends Particle {
  type: 'shadow' | 'shake' | 'wisp';
  size: number;
  currentX: number;
  currentY: number;
  angle: number;
  color: string;
}

export const fearEffect: Effect = {
  config: { name: 'fear', description: '恐怖 + 震え', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FearParticle[] = [];

    // Dark shadow
    particles.push({
      id: generateId(), type: 'shadow', x, y, progress: 0, maxProgress: 60,
      alpha: 0, size: 50, currentX: x, currentY: y, angle: 0, color: '#000000',
    });

    // Shaking lines
    const shakeCount = 6;
    for (let i = 0; i < shakeCount; i++) {
      particles.push({
        id: generateId(), type: 'shake', x, y, progress: 0, maxProgress: 50,
        delay: random(0, 20), alpha: 0, size: random(15, 25),
        currentX: x + random(-40, 40), currentY: y + random(-40, 40),
        angle: random(0, Math.PI * 2), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Wisps
    const wispCount = Math.floor(10 * intensity);
    for (let i = 0; i < wispCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'wisp', x, y, progress: 0, maxProgress: 45,
        delay: random(5, 30), alpha: 0, size: random(10, 25),
        currentX: x + Math.cos(angle) * random(30, 60),
        currentY: y + Math.sin(angle) * random(30, 60),
        angle, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FearParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'shadow') {
      p.size = 50 + Math.sin(p.progress * 0.1) * 10;
      p.alpha = (t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1) * 0.4;
    } else if (p.type === 'shake') {
      p.currentX = p.x + random(-40, 40) + Math.sin(p.progress * 0.5) * 5;
      p.alpha = (1 - t) * 0.6;
    } else {
      p.angle += 0.02;
      p.size *= 0.98;
      p.alpha = (1 - t) * 0.5;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FearParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'shadow') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '80');
      g.addColorStop(0.5, p.color + '40');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'shake') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const segments = 3;
      let px = p.currentX - p.size / 2;
      let py = p.currentY;
      ctx.moveTo(px, py);
      for (let i = 0; i < segments; i++) {
        px += p.size / segments;
        py = p.currentY + (i % 2 === 0 ? -5 : 5);
        ctx.lineTo(px, py);
      }
      ctx.stroke();
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
