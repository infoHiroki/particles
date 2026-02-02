/**
 * Silence エフェクト
 * 沈黙 + 封印 + サイレンス
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#666688', '#555577', '#444466'];
interface SilenceParticle extends Particle { type: 'cross' | 'ring'; size: number; rotation: number; color: string; }
export const silenceEffect: Effect = {
  config: { name: 'silence', description: '沈黙 + 封印', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SilenceParticle[] = [];
    particles.push({ id: generateId(), type: 'cross', x, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: 25, rotation: 0, color: DEFAULT_COLORS[0] });
    const ringCount = Math.floor(3 * intensity);
    for (let i = 0; i < ringCount; i++) {
      particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 50, delay: i * 8, alpha: 0, size: 15 + i * 10, rotation: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SilenceParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'ring') {
      p.size += 0.5;
    }
    p.alpha = Math.sin(t * Math.PI) * 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SilenceParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 3;
    if (p.type === 'cross') {
      ctx.beginPath();
      ctx.moveTo(p.x - p.size, p.y - p.size);
      ctx.lineTo(p.x + p.size, p.y + p.size);
      ctx.moveTo(p.x + p.size, p.y - p.size);
      ctx.lineTo(p.x - p.size, p.y + p.size);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
