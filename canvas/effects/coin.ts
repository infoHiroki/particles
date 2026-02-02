/**
 * Coin エフェクト
 * コイン + 回転 + 散乱
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ffd700', '#ffcc00', '#ffaa00'];

interface CoinParticle extends Particle {
  type: 'coin'; size: number; angle: number; distance: number; rotation: number; rotationSpeed: number;
  gravity: number; currentX: number; currentY: number; color: string;
}

export const coinEffect: Effect = {
  config: { name: 'coin', description: 'コイン + 回転 + 散乱', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CoinParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(-Math.PI, 0);
      particles.push({
        id: generateId(), type: 'coin', x, y, progress: 0, maxProgress: 60 + random(0, 30),
        delay: random(0, 10), alpha: 0, size: random(6, 12), angle,
        distance: random(50, 120), rotation: random(0, Math.PI * 2),
        rotationSpeed: random(0.2, 0.4), gravity: 0.15, currentX: x, currentY: y,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CoinParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const eased = easeOutCubic(t);
    p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
    p.currentY = p.y + Math.sin(p.angle) * p.distance * eased + t * t * p.gravity * 500;
    p.rotation += p.rotationSpeed;
    p.alpha = t > 0.7 ? (1 - t) / 0.3 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CoinParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    ctx.translate(p.currentX, p.currentY);
    const scaleX = Math.cos(p.rotation);
    ctx.scale(scaleX, 1);
    ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 5;
    ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffee88';
    ctx.beginPath(); ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
};
