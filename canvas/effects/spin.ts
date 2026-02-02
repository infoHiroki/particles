/**
 * Spin エフェクト
 * 回転 + 旋回 + 風
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#88ddff', '#66ccff', '#44bbff'];

interface SpinParticle extends Particle {
  type: 'ring' | 'trail' | 'spark';
  size: number;
  angle: number;
  angleSpeed: number;
  radius: number;
  color: string;
}

export const spinEffect: Effect = {
  config: { name: 'spin', description: '回転 + 旋回', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SpinParticle[] = [];

    // Spinning rings
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 50,
        delay: i * 5, alpha: 0, size: 30 + i * 15, angle: i * Math.PI / 3,
        angleSpeed: 0.15, radius: 0, color: DEFAULT_COLORS[i],
      });
    }

    // Trail particles
    const trailCount = Math.floor(20 * intensity);
    for (let i = 0; i < trailCount; i++) {
      const angle = random(0, Math.PI * 2);
      const radius = random(25, 50);
      particles.push({
        id: generateId(), type: 'trail', x, y, progress: 0, maxProgress: 40,
        delay: random(0, 20), alpha: 0, size: random(2, 4), angle,
        angleSpeed: random(0.1, 0.2), radius, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Sparks flying off
    const sparkCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 25,
        delay: random(10, 30), alpha: 0, size: random(2, 4), angle,
        angleSpeed: 0.05, radius: 40, color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SpinParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    p.angle += p.angleSpeed;

    if (p.type === 'ring') {
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8 * 0.6;
    } else if (p.type === 'trail') {
      p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    } else {
      p.radius += 3;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SpinParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'ring') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 1.5);
      ctx.stroke();
    } else {
      const px = p.x + Math.cos(p.angle) * p.radius;
      const py = p.y + Math.sin(p.angle) * p.radius;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
