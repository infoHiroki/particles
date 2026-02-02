/**
 * Whirlpool エフェクト
 * 渦 + 回転 + 吸い込み
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#2266cc'];
interface WhirlpoolParticle extends Particle { type: 'water'; size: number; angle: number; dist: number; speed: number; color: string; }
export const whirlpoolEffect: Effect = {
  config: { name: 'whirlpool', description: '渦 + 回転', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: WhirlpoolParticle[] = [];
    const count = Math.floor(30 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(20, 50);
      particles.push({ id: generateId(), type: 'water', x, y, progress: 0, maxProgress: 80, delay: random(0, 15), alpha: 0, size: random(3, 6), angle, dist, speed: random(0.08, 0.15), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WhirlpoolParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.speed * (1 + t);
    p.dist = p.dist * (1 - t * 0.015);
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WhirlpoolParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * (p.dist * 0.4);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
