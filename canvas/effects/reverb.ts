/**
 * Reverb エフェクト
 * リバーブ + 残響 + 空間
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#8888cc', '#9999dd', '#aaaaee'];
interface ReverbParticle extends Particle { type: 'dot'; size: number; vx: number; vy: number; fadeRate: number; color: string; }
export const reverbEffect: Effect = {
  config: { name: 'reverb', description: 'リバーブ + 残響', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ReverbParticle[] = [];
    const count = Math.floor(40 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 4);
      particles.push({ id: generateId(), type: 'dot', x, y, progress: 0, maxProgress: 60, delay: random(0, 20), alpha: 0, size: random(2, 5), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, fadeRate: random(0.95, 0.99), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ReverbParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= p.fadeRate;
    p.vy *= p.fadeRate;
    p.alpha = Math.sin(t * Math.PI) * 0.5;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ReverbParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
