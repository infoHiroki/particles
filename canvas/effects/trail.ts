/**
 * Trail エフェクト
 * 軌跡 + 残像 + フェード
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#00ff88', '#00ffaa', '#00ffcc'];

interface TrailParticle extends Particle {
  type: 'trail';
  size: number; vx: number; vy: number; currentX: number; currentY: number; color: string;
}

export const trailEffect: Effect = {
  config: { name: 'trail', description: '軌跡 + 残像', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const angle = (options.angle as number) ?? 0;
    const particles: TrailParticle[] = [];
    const count = Math.floor(30 * intensity);
    for (let i = 0; i < count; i++) {
      const a = angle + random(-0.3, 0.3);
      const speed = random(5, 10);
      particles.push({
        id: generateId(), type: 'trail', x, y, progress: 0, maxProgress: 25 + random(0, 15),
        delay: i * 0.5, alpha: 0, size: random(3, 6), vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed, currentX: x, currentY: y,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TrailParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.currentX += p.vx; p.currentY += p.vy;
    p.vx *= 0.95; p.vy *= 0.95;
    p.size *= 0.97;
    p.alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TrailParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
};
