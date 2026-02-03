/**
 * Primordial エフェクト
 * プライモーディアル + 原初 + 根源
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#884400', '#aa6622', '#cc8844'];
interface PrimordialParticle extends Particle { type: 'ember'; size: number; vx: number; vy: number; glow: number; color: string; }
export const primordialEffect: Effect = {
  config: { name: 'primordial', description: 'プライモーディアル + 原初', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PrimordialParticle[] = [];
    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(0.5, 2);
      particles.push({ id: generateId(), type: 'ember', x, y, progress: 0, maxProgress: 70, delay: random(0, 20), alpha: 0, size: random(3, 8), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.5, glow: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PrimordialParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vy -= 0.02;
    p.glow += 0.15;
    p.alpha = Math.sin(t * Math.PI) * (0.5 + Math.sin(p.glow) * 0.3);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PrimordialParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    gradient.addColorStop(0, '#ffaa44');
    gradient.addColorStop(0.5, p.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
