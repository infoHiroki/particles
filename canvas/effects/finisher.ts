/**
 * Finisher エフェクト
 * フィニッシャー + 必殺 + 止め
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0044', '#ff4488', '#ff88cc'];
interface FinisherParticle extends Particle { type: 'cross' | 'burst'; size: number; rotation: number; color: string; }
export const finisherEffect: Effect = {
  config: { name: 'finisher', description: 'フィニッシャー + 必殺', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FinisherParticle[] = [];
    particles.push({ id: generateId(), type: 'cross', x, y, progress: 0, maxProgress: 40, delay: 0, alpha: 0, size: 5, rotation: Math.PI / 4, color: DEFAULT_COLORS[0] });
    const burstCount = Math.floor(20 * intensity);
    for (let i = 0; i < burstCount; i++) {
      particles.push({ id: generateId(), type: 'burst', x: x + random(-50, 50), y: y + random(-50, 50), progress: 0, maxProgress: 35, delay: 10 + random(0, 10), alpha: 0, size: random(3, 8), rotation: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FinisherParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'cross') {
      p.size = 5 + Math.sin(t * Math.PI) * 50;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FinisherParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'cross') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-p.size, 0);
      ctx.lineTo(p.size, 0);
      ctx.moveTo(0, -p.size);
      ctx.lineTo(0, p.size);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
