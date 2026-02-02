/**
 * Absorb エフェクト
 * 吸収 + 収束 + 渦
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#88ff88', '#66dd66', '#44bb44'];

interface AbsorbParticle extends Particle {
  type: 'core' | 'spiral' | 'spark';
  size: number;
  angle: number;
  radius: number;
  radiusSpeed: number;
  color: string;
}

export const absorbEffect: Effect = {
  config: { name: 'absorb', description: '吸収 + 収束', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: AbsorbParticle[] = [];

    // Core
    particles.push({
      id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 50,
      alpha: 0, size: 15, angle: 0, radius: 0, radiusSpeed: 0, color: DEFAULT_COLORS[0],
    });

    // Spiral particles
    const spiralCount = Math.floor(20 * intensity);
    for (let i = 0; i < spiralCount; i++) {
      const angle = random(0, Math.PI * 2);
      const radius = random(60, 100);
      particles.push({
        id: generateId(), type: 'spiral', x, y, progress: 0, maxProgress: 45,
        delay: random(0, 15), alpha: 0, size: random(2, 4), angle,
        radius, radiusSpeed: -random(2, 3.5), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Converging sparks
    const sparkCount = Math.floor(12 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 35,
        delay: random(0, 20), alpha: 0, size: random(1.5, 3), angle,
        radius: random(80, 120), radiusSpeed: -random(3, 5), color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as AbsorbParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'core') {
      p.size = 15 + t * 10;
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 0.8;
    } else {
      p.angle += 0.08;
      p.radius += p.radiusSpeed;
      if (p.radius < 5) p.radius = 5;
      p.alpha = p.radius > 20 ? 1 : p.radius / 20;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as AbsorbParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'core') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
      g.addColorStop(0, p.color);
      g.addColorStop(0.5, p.color + '80');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const px = p.x + Math.cos(p.angle) * p.radius;
      const py = p.y + Math.sin(p.angle) * p.radius;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
