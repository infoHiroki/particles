/**
 * Counter エフェクト
 * カウンター + 反撃 + 返し
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4488', '#ff66aa', '#ff88cc'];
interface CounterParticle extends Particle { type: 'flash' | 'strike'; size: number; angle: number; length: number; color: string; }
export const counterEffect: Effect = {
  config: { name: 'counter', description: 'カウンター + 反撃', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CounterParticle[] = [];
    particles.push({ id: generateId(), type: 'flash', x, y, progress: 0, maxProgress: 10, delay: 0, alpha: 0, size: 25, angle: 0, length: 0, color: '#ffffff' });
    const strikeCount = Math.floor(4 * intensity);
    for (let i = 0; i < strikeCount; i++) {
      const angle = (i / strikeCount) * Math.PI * 2 + Math.PI / 4;
      particles.push({ id: generateId(), type: 'strike', x, y, progress: 0, maxProgress: 25, delay: 5, alpha: 0, size: 3, angle, length: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CounterParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'strike') {
      p.length = Math.sin(t * Math.PI) * 50;
    }
    p.alpha = 1 - t;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CounterParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'flash') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.length, p.y + Math.sin(p.angle) * p.length);
      ctx.stroke();
    }
    ctx.restore();
  },
};
