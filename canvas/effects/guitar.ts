/**
 * Guitar エフェクト
 * ギター + 弦 + 振動
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#996633', '#cc9966', '#ffcc00'];
interface GuitarParticle extends Particle { type: 'string' | 'wave'; size: number; phase: number; amp: number; stringIndex: number; color: string; }
export const guitarEffect: Effect = {
  config: { name: 'guitar', description: 'ギター + 弦', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GuitarParticle[] = [];
    const stringCount = 6;
    for (let i = 0; i < stringCount; i++) {
      particles.push({ id: generateId(), type: 'string', x, y: y - 15 + i * 6, progress: 0, maxProgress: 60, delay: i * 3, alpha: 0, size: 60, phase: 0, amp: random(3, 6), stringIndex: i, color: DEFAULT_COLORS[2] });
    }
    const waveCount = Math.floor(5 * intensity);
    for (let i = 0; i < waveCount; i++) {
      particles.push({ id: generateId(), type: 'wave', x: x + 40, y, progress: 0, maxProgress: 40, delay: 10 + i * 8, alpha: 0, size: 5 + i * 5, phase: 0, amp: 0, stringIndex: 0, color: DEFAULT_COLORS[0] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GuitarParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.3;
    if (p.type === 'string') {
      p.amp = p.amp * (1 - t * 0.02);
    } else {
      p.size += 0.5;
    }
    p.alpha = Math.sin(t * Math.PI) * (p.type === 'string' ? 1 : 0.5);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GuitarParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'string') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const px = p.x - p.size / 2 + t * p.size;
        const py = p.y + Math.sin(t * Math.PI * 3 + p.phase) * p.amp * Math.sin(t * Math.PI);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
