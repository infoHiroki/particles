/**
 * Contract エフェクト
 * 収縮 + 縮小 + 集中
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aa44ff', '#ff44aa', '#44ffaa'];
interface ContractParticle extends Particle { type: 'ring' | 'dot'; size: number; startSize: number; angle: number; dist: number; startDist: number; color: string; }
export const contractEffect: Effect = {
  config: { name: 'contract', description: '収縮 + 集中', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ContractParticle[] = [];
    const ringCount = Math.floor(3 * intensity);
    for (let i = 0; i < ringCount; i++) {
      particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 50, delay: i * 8, alpha: 0, size: 50 - i * 10, startSize: 50 - i * 10, angle: 0, dist: 0, startDist: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const dotCount = Math.floor(12 * intensity);
    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2;
      const startDist = random(40, 60);
      particles.push({ id: generateId(), type: 'dot', x, y, progress: 0, maxProgress: 50, delay: random(0, 15), alpha: 0, size: random(4, 8), startSize: 0, angle, dist: startDist, startDist, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ContractParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const ease = t * t;
    if (p.type === 'ring') {
      p.size = p.startSize * (1 - ease);
    } else {
      p.dist = p.startDist * (1 - ease);
    }
    p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ContractParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const px = p.x + Math.cos(p.angle) * p.dist;
      const py = p.y + Math.sin(p.angle) * p.dist;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
