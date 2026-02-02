/**
 * Wormhole エフェクト
 * ワームホール + トンネル + 時空
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ffaa', '#00aaff', '#aa00ff'];
interface WormholeParticle extends Particle { type: 'ring' | 'spiral'; size: number; angle: number; speed: number; layer: number; color: string; }
export const wormholeEffect: Effect = {
  config: { name: 'wormhole', description: 'ワームホール + トンネル', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: WormholeParticle[] = [];
    const ringCount = Math.floor(8 * intensity);
    for (let i = 0; i < ringCount; i++) {
      particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 80, delay: i * 5, alpha: 0, size: 50 - i * 5, angle: 0, speed: 0, layer: i, color: DEFAULT_COLORS[i % 3] });
    }
    const spiralCount = Math.floor(20 * intensity);
    for (let i = 0; i < spiralCount; i++) {
      const angle = (i / spiralCount) * Math.PI * 4;
      particles.push({ id: generateId(), type: 'spiral', x, y, progress: 0, maxProgress: 70, delay: random(0, 20), alpha: 0, size: random(2, 5), angle, speed: random(0.1, 0.2), layer: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WormholeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'ring') {
      p.size = (50 - p.layer * 5) * (1 - t * 0.5);
    } else {
      p.angle += p.speed;
    }
    p.alpha = Math.sin(t * Math.PI) * (p.type === 'ring' ? 0.6 : 0.8);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WormholeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const dist = 20 + p.angle * 3;
      const px = p.x + Math.cos(p.angle) * dist;
      const py = p.y + Math.sin(p.angle) * (dist * 0.3);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
