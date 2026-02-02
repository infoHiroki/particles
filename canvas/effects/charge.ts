/**
 * Charge エフェクト
 * チャージ + 収束 + 蓄積
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeInQuad } from '../utils';

const DEFAULT_COLORS = ['#ffff00', '#ffaa00', '#ff6600'];

interface ChargeParticle extends Particle {
  type: 'particle' | 'core';
  size: number; angle: number; radius: number; radiusSpeed: number;
  currentX: number; currentY: number; color: string; pulsePhase: number;
}

export const chargeEffect: Effect = {
  config: { name: 'charge', description: 'チャージ + 収束', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: ChargeParticle[] = [];
    // Core
    particles.push({
      id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 60, alpha: 0,
      size: 10, angle: 0, radius: 0, radiusSpeed: 0, currentX: x, currentY: y,
      color: colors[0], pulsePhase: 0,
    });
    // Particles
    const count = Math.floor(30 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'particle', x, y, progress: 0, maxProgress: 50 + random(0, 20),
        delay: random(0, 15), alpha: 0, size: random(2, 4), angle,
        radius: random(60, 100), radiusSpeed: -random(1.5, 2.5),
        currentX: x + Math.cos(angle) * 80, currentY: y + Math.sin(angle) * 80,
        color: randomPick(colors), pulsePhase: 0,
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ChargeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'core') {
      p.pulsePhase += 0.15;
      p.size = 10 + Math.sin(p.pulsePhase) * 3 + t * 15;
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
    } else {
      p.angle += 0.05;
      p.radius += p.radiusSpeed;
      if (p.radius < 5) p.radius = 5;
      p.currentX = p.x + Math.cos(p.angle) * p.radius;
      p.currentY = p.y + Math.sin(p.angle) * p.radius;
      p.alpha = p.radius > 20 ? 1 - easeInQuad(t) : (p.radius / 20) * (1 - easeInQuad(t));
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ChargeParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    if (p.type === 'core') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
      g.addColorStop(0, p.color); g.addColorStop(0.5, p.color + '80'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 5;
      ctx.beginPath(); ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
};
