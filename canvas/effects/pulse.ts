/**
 * Pulse エフェクト
 * パルス + 波紋 + 拡大
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ff4488', '#ff66aa', '#ff88cc'];

interface PulseParticle extends Particle {
  type: 'ring' | 'dot'; radius: number; maxRadius: number; color: string;
  currentX: number; currentY: number;
}

export const pulseEffect: Effect = {
  config: { name: 'pulse', description: 'パルス + 波紋', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PulseParticle[] = [];
    for (let i = 0; i < 4; i++) {
      particles.push({
        id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 40 + i * 10,
        delay: i * 8, alpha: 0, radius: 10, maxRadius: 80 + i * 20,
        color: DEFAULT_COLORS[i % 3], currentX: x, currentY: y,
      });
    }
    const dotCount = Math.floor(12 * intensity);
    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'dot', x, y, progress: 0, maxProgress: 35,
        delay: random(5, 15), alpha: 0, radius: random(2, 4), maxRadius: random(40, 70),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
        currentX: x, currentY: y,
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PulseParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const eased = easeOutCubic(t);
    if (p.type === 'ring') {
      p.radius = 10 + (p.maxRadius - 10) * eased;
      p.alpha = 1 - eased;
    } else {
      p.currentX = p.x + Math.cos(t * Math.PI * 2) * p.maxRadius * eased;
      p.currentY = p.y + Math.sin(t * Math.PI * 2) * p.maxRadius * eased;
      p.alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PulseParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    if (p.type === 'ring') {
      ctx.strokeStyle = p.color; ctx.lineWidth = 3; ctx.shadowColor = p.color; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.fillStyle = p.color; ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
};
