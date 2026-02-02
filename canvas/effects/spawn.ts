/**
 * Spawn エフェクト
 * 出現 + 光柱 + 収束
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffffff', '#aaffff', '#88ddff'];

interface SpawnParticle extends Particle {
  type: 'pillar' | 'spark';
  size: number;
  currentX: number;
  currentY: number;
  vy: number;
  angle: number;
  radius: number;
  color: string;
}

export const spawnEffect: Effect = {
  config: { name: 'spawn', description: '出現 + 光柱', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SpawnParticle[] = [];

    // Light pillar
    particles.push({
      id: generateId(), type: 'pillar', x, y, progress: 0, maxProgress: 50,
      alpha: 0, size: 60, currentX: x, currentY: y, vy: 0, angle: 0, radius: 0,
      color: DEFAULT_COLORS[0],
    });

    // Converging sparks
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const radius = random(80, 150);
      particles.push({
        id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 40,
        delay: random(0, 15), alpha: 0, size: random(2, 4),
        currentX: x + Math.cos(angle) * radius, currentY: y + Math.sin(angle) * radius,
        vy: 0, angle, radius, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SpawnParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'pillar') {
      p.alpha = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1;
      p.size = 60 * (1 - t * 0.5);
    } else {
      p.radius -= 3;
      if (p.radius < 5) p.radius = 5;
      p.currentX = p.x + Math.cos(p.angle) * p.radius;
      p.currentY = p.y + Math.sin(p.angle) * p.radius;
      p.alpha = p.radius > 30 ? 1 : p.radius / 30;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SpawnParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'pillar') {
      const g = ctx.createLinearGradient(p.x, p.y - 100, p.x, p.y + 50);
      g.addColorStop(0, 'transparent');
      g.addColorStop(0.3, p.color + '80');
      g.addColorStop(0.5, p.color);
      g.addColorStop(0.7, p.color + '80');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - p.size / 2, p.y - 100, p.size, 150);
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
