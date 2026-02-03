/**
 * Unity エフェクト
 * ユニティ + 統一 + 融合
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ddddff', '#bbbbff'];
interface UnityParticle extends Particle { type: 'dot'; startX: number; startY: number; targetX: number; targetY: number; color: string; }
export const unityEffect: Effect = {
  config: { name: 'unity', description: 'ユニティ + 統一', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: UnityParticle[] = [];
    const count = Math.floor(40 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(60, 100);
      particles.push({ id: generateId(), type: 'dot', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, startX: x + Math.cos(angle) * dist, startY: y + Math.sin(angle) * dist, targetX: x, targetY: y, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as UnityParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const ease = 1 - Math.pow(1 - t, 3);
    p.x = p.startX + (p.targetX - p.startX) * ease;
    p.y = p.startY + (p.targetY - p.startY) * ease;
    p.alpha = 1 - t * 0.5;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as UnityParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
