/**
 * Void エフェクト
 * 虚空 + 吸収 + 暗黒
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#220033', '#330044', '#440066'];

interface VoidParticle extends Particle {
  type: 'core' | 'spiral' | 'wisp';
  size: number;
  angle: number;
  radius: number;
  radiusSpeed: number;
  color: string;
}

export const voidEffect: Effect = {
  config: { name: 'void', description: '虚空 + 吸収', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: VoidParticle[] = [];

    // Dark core
    particles.push({
      id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 70,
      alpha: 0, size: 30, angle: 0, radius: 0, radiusSpeed: 0, color: '#000000',
    });

    // Spiraling particles
    const spiralCount = Math.floor(25 * intensity);
    for (let i = 0; i < spiralCount; i++) {
      const angle = random(0, Math.PI * 2);
      const radius = random(60, 100);
      particles.push({
        id: generateId(), type: 'spiral', x, y, progress: 0, maxProgress: 55,
        delay: random(0, 20), alpha: 0, size: random(2, 4), angle,
        radius, radiusSpeed: -random(1.5, 2.5), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Wisps
    const wispCount = Math.floor(10 * intensity);
    for (let i = 0; i < wispCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'wisp', x, y, progress: 0, maxProgress: 60,
        delay: random(0, 30), alpha: 0, size: random(8, 15), angle,
        radius: random(40, 70), radiusSpeed: -random(0.8, 1.5),
        color: '#6644aa',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as VoidParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'core') {
      p.size = 30 + Math.sin(p.progress * 0.08) * 5;
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.85 ? (1 - t) / 0.15 : 1;
    } else if (p.type === 'spiral') {
      p.angle += 0.1;
      p.radius += p.radiusSpeed;
      if (p.radius < 5) p.radius = 5;
      p.alpha = p.radius > 20 ? 0.8 : (p.radius / 20) * 0.8;
    } else {
      p.angle += 0.05;
      p.radius += p.radiusSpeed;
      if (p.radius < 10) p.radius = 10;
      p.size *= 0.98;
      p.alpha = (p.radius > 25 ? 1 : p.radius / 25) * 0.5;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as VoidParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'core') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.5);
      g.addColorStop(0, p.color);
      g.addColorStop(0.5, '#220033');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Inner ring
      ctx.strokeStyle = '#6644aa40';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'spiral') {
      const px = p.x + Math.cos(p.angle) * p.radius;
      const py = p.y + Math.sin(p.angle) * p.radius;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const px = p.x + Math.cos(p.angle) * p.radius;
      const py = p.y + Math.sin(p.angle) * p.radius;
      const g = ctx.createRadialGradient(px, py, 0, px, py, p.size);
      g.addColorStop(0, p.color + '80');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
