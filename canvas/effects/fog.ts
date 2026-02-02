/**
 * Fog エフェクト
 * 霧 + 漂い + 拡散
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#aaaaaa', '#999999', '#bbbbbb'];

interface FogParticle extends Particle {
  type: 'fog'; size: number; vx: number; vy: number; currentX: number; currentY: number; color: string;
}

export const fogEffect: Effect = {
  config: { name: 'fog', description: '霧 + 漂い', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FogParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({
        id: generateId(), type: 'fog', x: x + random(-80, 80), y: y + random(-40, 40),
        progress: 0, maxProgress: 120 + random(0, 60), delay: random(0, 30), alpha: 0,
        size: random(50, 100), vx: random(-0.3, 0.3), vy: random(-0.1, 0.1),
        currentX: x + random(-80, 80), currentY: y + random(-40, 40),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FogParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.currentX += p.vx; p.currentY += p.vy;
    p.size += 0.2;
    p.alpha = t < 0.3 ? t / 0.3 * 0.25 : 0.25 * (1 - (t - 0.3) / 0.7);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FogParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    const gradient = ctx.createRadialGradient(p.currentX, p.currentY, 0, p.currentX, p.currentY, p.size);
    gradient.addColorStop(0, p.color + '40'); gradient.addColorStop(0.5, p.color + '20'); gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
};
