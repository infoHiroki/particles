/**
 * Fusion2 エフェクト
 * フュージョン2 + 融合 + 合体
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff88ff', '#88ffff', '#ffff88'];
interface Fusion2Particle extends Particle { type: 'energy'; size: number; angle: number; dist: number; targetDist: number; hue: number; color: string; }
export const fusion2Effect: Effect = {
  config: { name: 'fusion2', description: 'フュージョン2 + 融合', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Fusion2Particle[] = [];
    const count = Math.floor(30 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(50, 80);
      particles.push({ id: generateId(), type: 'energy', x, y, progress: 0, maxProgress: 55, delay: random(0, 10), alpha: 0, size: random(4, 8), angle, dist, targetDist: 0, hue: random(0, 360), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Fusion2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += 0.05;
    p.dist = p.dist * (1 - t * 0.8);
    p.hue += 2;
    p.size = 4 + (1 - t) * 4;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Fusion2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * p.dist;
    ctx.fillStyle = `hsl(${p.hue}, 80%, 60%)`;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
