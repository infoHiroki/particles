/**
 * Web エフェクト
 * 蜘蛛の巣 + ウェブ + 網
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#dddddd', '#bbbbbb'];
interface WebParticle extends Particle { type: 'radial' | 'spiral'; size: number; angle: number; ringIndex: number; color: string; }
export const webEffect: Effect = {
  config: { name: 'web', description: '蜘蛛の巣 + ウェブ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: WebParticle[] = [];
    const radialCount = 8;
    for (let i = 0; i < radialCount; i++) {
      const angle = (i / radialCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'radial', x, y, progress: 0, maxProgress: 50, delay: i, alpha: 0, size: 40, angle, ringIndex: 0, color: DEFAULT_COLORS[0] });
    }
    const ringCount = Math.floor(4 * intensity);
    for (let r = 0; r < ringCount; r++) {
      particles.push({ id: generateId(), type: 'spiral', x, y, progress: 0, maxProgress: 50, delay: radialCount + r * 3, alpha: 0, size: 10 + r * 10, angle: 0, ringIndex: r, color: DEFAULT_COLORS[r % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WebParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI) * 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WebParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    if (p.type === 'radial') {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.size, p.y + Math.sin(p.angle) * p.size);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
