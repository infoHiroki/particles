/**
 * Lock エフェクト
 * ロック + 閉鎖 + 制限
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#888888', '#666666', '#444444'];

interface LockParticle extends Particle {
  type: 'lock' | 'chain' | 'spark';
  size: number;
  angle: number;
  radius: number;
  color: string;
}

export const lockEffect: Effect = {
  config: { name: 'lock', description: 'ロック + 閉鎖', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: LockParticle[] = [];

    // Lock icon
    particles.push({
      id: generateId(), type: 'lock', x, y, progress: 0, maxProgress: 45,
      alpha: 0, size: 30, angle: 0, radius: 0, color: DEFAULT_COLORS[0],
    });

    // Chains
    const chainCount = 6;
    for (let i = 0; i < chainCount; i++) {
      const angle = (i / chainCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'chain', x, y, progress: 0, maxProgress: 40,
        delay: i * 3, alpha: 0, size: 8, angle, radius: 50 + random(-10, 10),
        color: DEFAULT_COLORS[1],
      });
    }

    // Metal sparks
    const sparkCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({
        id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 25,
        delay: random(5, 20), alpha: 0, size: random(2, 3),
        angle: random(0, Math.PI * 2), radius: random(20, 40),
        color: '#aaaaaa',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LockParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'lock') {
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
      p.size = 30 * (1 + (1 - t) * 0.1);
    } else if (p.type === 'chain') {
      p.radius = 50 - t * 30;
      p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7;
    } else {
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LockParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'lock') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;

      // Lock body
      ctx.beginPath();
      ctx.roundRect(p.x - p.size / 2, p.y - p.size / 4, p.size, p.size * 0.8, 3);
      ctx.stroke();

      // Closed shackle
      ctx.beginPath();
      ctx.arc(p.x, p.y - p.size / 4, p.size * 0.35, Math.PI, 0);
      ctx.lineTo(p.x + p.size * 0.35, p.y - p.size / 4);
      ctx.stroke();

      // Keyhole
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y + p.size * 0.1, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(p.x - 2, p.y + p.size * 0.1, 4, 8);
    } else if (p.type === 'chain') {
      const px = p.x + Math.cos(p.angle) * p.radius;
      const py = p.y + Math.sin(p.angle) * p.radius;

      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      // Chain link
      ctx.beginPath();
      ctx.ellipse(px, py, p.size, p.size * 0.6, p.angle, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const px = p.x + Math.cos(p.angle) * p.radius;
      const py = p.y + Math.sin(p.angle) * p.radius;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
