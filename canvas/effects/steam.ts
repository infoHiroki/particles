/**
 * Steam エフェクト
 * 蒸気 + 上昇 + 拡散
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffffff', '#eeeeee', '#dddddd'];

interface SteamParticle extends Particle {
  type: 'steam'; size: number; vx: number; vy: number; currentX: number; currentY: number; color: string;
}

export const steamEffect: Effect = {
  config: { name: 'steam', description: '蒸気 + 上昇', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SteamParticle[] = [];
    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({
        id: generateId(), type: 'steam', x: x + random(-20, 20), y,
        progress: 0, maxProgress: 80 + random(0, 40), delay: random(0, 30), alpha: 0,
        size: random(15, 30), vx: random(-0.3, 0.3), vy: random(-1.5, -0.8),
        currentX: x + random(-20, 20), currentY: y,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SteamParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.currentX += p.vx + Math.sin(p.progress * 0.05) * 0.3;
    p.currentY += p.vy;
    p.size += 0.3;
    p.alpha = t < 0.2 ? t / 0.2 * 0.4 : 0.4 * (1 - (t - 0.2) / 0.8);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SteamParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    const gradient = ctx.createRadialGradient(p.currentX, p.currentY, 0, p.currentX, p.currentY, p.size);
    gradient.addColorStop(0, p.color + '60'); gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
};
