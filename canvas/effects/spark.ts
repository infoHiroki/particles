/**
 * Spark エフェクト
 * 火花 + 飛散 + 軌跡
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ffcc00', '#ff8800', '#ff4400'];

interface SparkParticle extends Particle {
  type: 'spark';
  size: number; angle: number; distance: number; speed: number; gravity: number;
  currentX: number; currentY: number; color: string;
  trail: { x: number; y: number }[];
}

export const sparkEffect: Effect = {
  config: { name: 'spark', description: '火花 + 飛散', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SparkParticle[] = [];
    const count = Math.floor(30 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 30 + random(0, 20),
        delay: random(0, 5), alpha: 0, size: random(1, 3), angle,
        distance: random(50, 120), speed: random(4, 8), gravity: 0.15,
        currentX: x, currentY: y, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
        trail: [],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SparkParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const eased = easeOutCubic(t);
    p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
    p.currentY = p.y + Math.sin(p.angle) * p.distance * eased + t * t * p.gravity * 400;
    p.trail.unshift({ x: p.currentX, y: p.currentY });
    if (p.trail.length > 5) p.trail.pop();
    p.alpha = 1 - easeOutCubic(t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SparkParticle;
    ctx.save();
    // Trail
    if (p.trail.length > 1) {
      ctx.globalAlpha = p.alpha * 0.5;
      ctx.strokeStyle = p.color; ctx.lineWidth = p.size * 0.5;
      ctx.beginPath(); ctx.moveTo(p.trail[0].x, p.trail[0].y);
      for (let i = 1; i < p.trail.length; i++) ctx.lineTo(p.trail[i].x, p.trail[i].y);
      ctx.stroke();
    }
    // Spark
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = '#ffffff'; ctx.shadowColor = p.color; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
};
