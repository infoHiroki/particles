/**
 * Beam エフェクト
 * 光線 + 収束 + 発射
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#00ffff', '#00aaff', '#0066ff'];

interface BeamParticle extends Particle {
  type: 'beam' | 'charge' | 'spark';
  angle: number; length: number; width: number; currentLength: number;
  currentX: number; currentY: number; color: string; radius: number;
}

export const beamEffect: Effect = {
  config: { name: 'beam', description: '光線 + 収束', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const angle = (options.angle as number) ?? 0;
    const particles: BeamParticle[] = [];
    // Charge particles
    const chargeCount = Math.floor(15 * intensity);
    for (let i = 0; i < chargeCount; i++) {
      const a = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'charge', x, y, progress: 0, maxProgress: 20,
        delay: random(0, 5), alpha: 0, angle: a, length: 0, width: 0, currentLength: 0,
        currentX: x + Math.cos(a) * random(30, 60), currentY: y + Math.sin(a) * random(30, 60),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))], radius: random(2, 4),
      });
    }
    // Main beam
    particles.push({
      id: generateId(), type: 'beam', x, y, progress: 0, maxProgress: 25, delay: 20,
      alpha: 0, angle, length: 250, width: 8, currentLength: 0, currentX: x, currentY: y,
      color: DEFAULT_COLORS[0], radius: 0,
    });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BeamParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'charge') {
      const dist = (1 - easeOutCubic(t)) * 50;
      p.currentX = p.x + Math.cos(p.angle) * dist;
      p.currentY = p.y + Math.sin(p.angle) * dist;
      p.alpha = 1 - t;
    } else if (p.type === 'beam') {
      p.currentLength = p.length * (t < 0.3 ? easeOutCubic(t / 0.3) : 1);
      p.alpha = t < 0.3 ? 1 : 1 - (t - 0.3) / 0.7;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BeamParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    if (p.type === 'charge') {
      ctx.fillStyle = p.color; ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.radius, 0, Math.PI * 2); ctx.fill();
    } else if (p.type === 'beam') {
      ctx.strokeStyle = p.color; ctx.lineWidth = p.width; ctx.lineCap = 'round';
      ctx.shadowColor = p.color; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.currentLength, p.y + Math.sin(p.angle) * p.currentLength);
      ctx.stroke();
    }
    ctx.restore();
  },
};
