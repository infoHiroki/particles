/**
 * Merge エフェクト
 * 合体 + 集合 + 融合
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa66', '#66aaff', '#aa66ff'];
interface MergeParticle extends Particle { type: 'fragment' | 'core'; size: number; targetX: number; targetY: number; startX: number; startY: number; color: string; }
export const mergeEffect: Effect = {
  config: { name: 'merge', description: '合体 + 融合', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MergeParticle[] = [];
    const fragCount = Math.floor(12 * intensity);
    for (let i = 0; i < fragCount; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(40, 70);
      const startX = x + Math.cos(angle) * dist;
      const startY = y + Math.sin(angle) * dist;
      particles.push({ id: generateId(), type: 'fragment', x: startX, y: startY, progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, size: random(5, 10), targetX: x, targetY: y, startX, startY, color: DEFAULT_COLORS[i % 3] });
    }
    particles.push({ id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 40, delay: 40, alpha: 0, size: 25, targetX: x, targetY: y, startX: x, startY: y, color: '#ffffff' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MergeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'fragment') {
      const ease = t * t * (3 - 2 * t);
      p.x = p.startX + (p.targetX - p.startX) * ease;
      p.y = p.startY + (p.targetY - p.startY) * ease;
      p.size = (1 - t) * 8 + 2;
    }
    p.alpha = p.type === 'core' ? (t < 0.3 ? t / 0.3 : (1 - t) / 0.7) : (1 - t * 0.5);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MergeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'core') {
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 20;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
