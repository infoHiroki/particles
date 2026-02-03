/**
 * Treble エフェクト
 * トレブル + 高音 + きらめき
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ffff', '#44ffff', '#88ffff'];
interface TrebleParticle extends Particle { type: 'spark'; size: number; vx: number; vy: number; twinkle: number; color: string; }
export const trebleEffect: Effect = {
  config: { name: 'treble', description: 'トレブル + 高音', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TrebleParticle[] = [];
    const count = Math.floor(30 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(2, 5);
      particles.push({ id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 35, delay: random(0, 10), alpha: 0, size: random(2, 4), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, twinkle: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TrebleParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.twinkle += 0.4;
    p.alpha = Math.sin(t * Math.PI) * (0.5 + Math.sin(p.twinkle) * 0.5);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TrebleParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
