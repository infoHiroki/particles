/**
 * Regen エフェクト
 * 再生 + 回復 + リジェネ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44ff88', '#66ffaa', '#88ffcc'];
interface RegenParticle extends Particle { type: 'plus' | 'sparkle'; size: number; vy: number; rotation: number; color: string; }
export const regenEffect: Effect = {
  config: { name: 'regen', description: '再生 + 回復', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RegenParticle[] = [];
    const plusCount = Math.floor(4 * intensity);
    for (let i = 0; i < plusCount; i++) {
      particles.push({ id: generateId(), type: 'plus', x: x + random(-30, 30), y: y + random(-10, 10), progress: 0, maxProgress: 45, delay: i * 8, alpha: 0, size: random(8, 12), vy: random(-1, -0.5), rotation: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const sparkleCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-35, 35), y: y + random(-15, 15), progress: 0, maxProgress: 40, delay: random(0, 20), alpha: 0, size: random(2, 4), vy: random(-0.8, -0.3), rotation: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RegenParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RegenParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'plus') {
      ctx.fillRect(p.x - p.size / 6, p.y - p.size / 2, p.size / 3, p.size);
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 6, p.size, p.size / 3);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
