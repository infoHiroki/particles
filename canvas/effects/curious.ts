/**
 * Curious エフェクト
 * 好奇心 + 疑問 + 探求
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#66aaff', '#88bbff', '#aaccff'];

interface CuriousParticle extends Particle {
  type: 'question' | 'orbit' | 'sparkle';
  size: number;
  currentX: number;
  currentY: number;
  angle: number;
  radius: number;
  color: string;
}

export const curiousEffect: Effect = {
  config: { name: 'curious', description: '好奇心 + 疑問', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CuriousParticle[] = [];

    // Question mark
    particles.push({
      id: generateId(), type: 'question', x, y: y - 25, progress: 0, maxProgress: 55,
      alpha: 0, size: 28, currentX: x, currentY: y - 25, angle: 0, radius: 0,
      color: DEFAULT_COLORS[0],
    });

    // Orbiting particles
    const orbitCount = 5;
    for (let i = 0; i < orbitCount; i++) {
      const angle = (i / orbitCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'orbit', x, y, progress: 0, maxProgress: 60,
        delay: i * 4, alpha: 0, size: random(4, 7), currentX: x, currentY: y,
        angle, radius: 35, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Sparkles
    const sparkleCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        id: generateId(), type: 'sparkle', x, y, progress: 0, maxProgress: 40,
        delay: random(10, 35), alpha: 0, size: random(2, 4),
        currentX: x + random(-45, 45), currentY: y + random(-45, 45),
        angle: 0, radius: 0, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CuriousParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'question') {
      p.currentY = p.y - 25 + Math.sin(p.progress * 0.1) * 5;
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
    } else if (p.type === 'orbit') {
      p.angle += 0.05;
      p.currentX = p.x + Math.cos(p.angle) * p.radius;
      p.currentY = p.y + Math.sin(p.angle) * p.radius;
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    } else {
      p.alpha = Math.abs(Math.sin(p.progress * 0.3)) * (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CuriousParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'question') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.font = `bold ${p.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', p.currentX, p.currentY);
    } else if (p.type === 'orbit') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
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
