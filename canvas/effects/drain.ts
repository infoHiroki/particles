/**
 * Drain エフェクト
 * ドレイン + 吸収 + 吸い取り
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aa00ff', '#cc44ff', '#ee88ff'];
interface DrainParticle extends Particle { type: 'orb'; size: number; angle: number; dist: number; startDist: number; color: string; }
export const drainEffect: Effect = {
  config: { name: 'drain', description: 'ドレイン + 吸収', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DrainParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const startDist = random(40, 70);
      particles.push({ id: generateId(), type: 'orb', x, y, progress: 0, maxProgress: 45, delay: i * 2, alpha: 0, size: random(3, 6), angle, dist: startDist, startDist, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DrainParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const ease = t * t;
    p.dist = p.startDist * (1 - ease);
    p.angle += 0.05;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DrainParticle;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * p.dist;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
