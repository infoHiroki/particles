/**
 * Reflect エフェクト
 * 反射 + バリア + 跳ね返り
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#88ccff', '#aaddff', '#cceeff'];

interface ReflectParticle extends Particle {
  type: 'barrier' | 'reflect' | 'spark';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  angle: number;
  color: string;
}

export const reflectEffect: Effect = {
  config: { name: 'reflect', description: '反射 + バリア', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ReflectParticle[] = [];

    // Barrier
    particles.push({
      id: generateId(), type: 'barrier', x, y, progress: 0, maxProgress: 30,
      alpha: 0, size: 50, currentX: x, currentY: y, vx: 0, vy: 0, angle: 0,
      color: DEFAULT_COLORS[0],
    });

    // Reflecting particles
    const reflectCount = Math.floor(8 * intensity);
    for (let i = 0; i < reflectCount; i++) {
      const angle = random(-0.5, 0.5);
      particles.push({
        id: generateId(), type: 'reflect', x, y, progress: 0, maxProgress: 25,
        delay: random(0, 5), alpha: 0, size: random(3, 6),
        currentX: x, currentY: y,
        vx: -random(8, 15), vy: Math.sin(angle) * random(3, 8),
        angle, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Sparks
    const sparkCount = Math.floor(12 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(Math.PI * 0.3, Math.PI * 0.7);
      particles.push({
        id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 20,
        delay: random(0, 3), alpha: 0, size: random(1.5, 3),
        currentX: x, currentY: y,
        vx: Math.cos(angle) * random(5, 12), vy: Math.sin(angle) * random(5, 12),
        angle: 0, color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ReflectParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'barrier') {
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    } else {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ReflectParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'barrier') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
