/**
 * Split エフェクト
 * 分裂 + 拡散 + 分離
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6666', '#66ff66', '#6666ff'];
interface SplitParticle extends Particle { type: 'core' | 'fragment'; size: number; vx: number; vy: number; generation: number; color: string; }
export const splitEffect: Effect = {
  config: { name: 'split', description: '分裂 + 拡散', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SplitParticle[] = [];
    particles.push({ id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 20, alpha: 0, size: 25, vx: 0, vy: 0, generation: 0, color: DEFAULT_COLORS[0] });
    const fragCount = Math.floor(6 * intensity);
    for (let i = 0; i < fragCount; i++) {
      const angle = (i / fragCount) * Math.PI * 2;
      const speed = random(2, 3.5);
      particles.push({ id: generateId(), type: 'fragment', x, y, progress: 0, maxProgress: 50, delay: 15, alpha: 0, size: random(8, 14), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, generation: 1, color: DEFAULT_COLORS[1] });
    }
    const smallFragCount = Math.floor(12 * intensity);
    for (let i = 0; i < smallFragCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1.5, 3);
      particles.push({ id: generateId(), type: 'fragment', x, y, progress: 0, maxProgress: 45, delay: 25 + random(0, 10), alpha: 0, size: random(3, 6), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, generation: 2, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SplitParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'fragment') {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy *= 0.97;
    }
    p.alpha = t < 0.1 ? t / 0.1 : (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SplitParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.generation === 0 ? 15 : 5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
