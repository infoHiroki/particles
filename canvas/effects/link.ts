/**
 * Link エフェクト
 * リンク + 接続 + つながり
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aaff', '#66bbff', '#88ccff'];
interface LinkParticle extends Particle { type: 'node' | 'line'; size: number; targetX: number; targetY: number; color: string; }
export const linkEffect: Effect = {
  config: { name: 'link', description: 'リンク + 接続', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: LinkParticle[] = [];
    const nodeCount = Math.floor(6 * intensity);
    const nodes: {x: number, y: number}[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const nx = x + random(-40, 40);
      const ny = y + random(-40, 40);
      nodes.push({x: nx, y: ny});
      particles.push({ id: generateId(), type: 'node', x: nx, y: ny, progress: 0, maxProgress: 50, delay: i * 3, alpha: 0, size: random(4, 6), targetX: 0, targetY: 0, color: DEFAULT_COLORS[i % 3] });
    }
    for (let i = 0; i < nodeCount - 1; i++) {
      particles.push({ id: generateId(), type: 'line', x: nodes[i].x, y: nodes[i].y, progress: 0, maxProgress: 50, delay: (i + 1) * 3 + 5, alpha: 0, size: 1, targetX: nodes[i + 1].x, targetY: nodes[i + 1].y, color: DEFAULT_COLORS[0] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LinkParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LinkParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'node') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.targetX, p.targetY);
      ctx.stroke();
    }
    ctx.restore();
  },
};
