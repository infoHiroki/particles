/**
 * Love エフェクト
 * 愛 + ハート + 輝き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff6699', '#ff4488', '#ff2277'];

interface LoveParticle extends Particle {
  type: 'heart' | 'sparkle' | 'float';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
}

export const loveEffect: Effect = {
  config: { name: 'love', description: '愛 + ハート', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: LoveParticle[] = [];

    // Main heart
    particles.push({
      id: generateId(), type: 'heart', x, y, progress: 0, maxProgress: 50,
      alpha: 0, size: 30, currentX: x, currentY: y, vx: 0, vy: -1,
      rotation: 0, color: DEFAULT_COLORS[0],
    });

    // Floating hearts
    const floatCount = Math.floor(8 * intensity);
    for (let i = 0; i < floatCount; i++) {
      particles.push({
        id: generateId(), type: 'float', x, y, progress: 0, maxProgress: 60,
        delay: random(5, 25), alpha: 0, size: random(10, 18),
        currentX: x + random(-40, 40), currentY: y + random(-20, 20),
        vx: random(-0.5, 0.5), vy: -random(1, 2.5), rotation: random(-0.3, 0.3),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Sparkles
    const sparkleCount = Math.floor(12 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        id: generateId(), type: 'sparkle', x, y, progress: 0, maxProgress: 35,
        delay: random(0, 30), alpha: 0, size: random(2, 4),
        currentX: x + random(-50, 50), currentY: y + random(-50, 50),
        vx: 0, vy: 0, rotation: random(0, Math.PI * 2), color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LoveParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'heart') {
      p.currentY += p.vy;
      p.size = 30 + Math.sin(p.progress * 0.15) * 5;
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1;
    } else if (p.type === 'float') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.rotation += 0.02;
      p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    } else {
      p.alpha = Math.abs(Math.sin(p.progress * 0.3)) * (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LoveParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'heart' || p.type === 'float') {
      ctx.translate(p.currentX, p.currentY);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;

      // Draw heart
      ctx.beginPath();
      ctx.moveTo(0, p.size * 0.3);
      ctx.bezierCurveTo(-p.size * 0.5, -p.size * 0.3, -p.size, p.size * 0.1, 0, p.size);
      ctx.bezierCurveTo(p.size, p.size * 0.1, p.size * 0.5, -p.size * 0.3, 0, p.size * 0.3);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
