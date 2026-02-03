/**
 * Beat エフェクト
 * ビート + 鼓動 + リズム
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0066', '#ff3388', '#ff66aa'];
interface BeatParticle extends Particle { type: 'pulse'; size: number; baseSize: number; beatPhase: number; color: string; }
export const beatEffect: Effect = {
  config: { name: 'beat', description: 'ビート + 鼓動', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BeatParticle[] = [];
    particles.push({ id: generateId(), type: 'pulse', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 30, baseSize: 30, beatPhase: 0, color: DEFAULT_COLORS[0] });
    const ringCount = Math.floor(4 * intensity);
    for (let i = 0; i < ringCount; i++) {
      particles.push({ id: generateId(), type: 'pulse', x, y, progress: 0, maxProgress: 50, delay: 10 + i * 8, alpha: 0, size: 10, baseSize: 10, beatPhase: 0, color: DEFAULT_COLORS[(i + 1) % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BeatParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.beatPhase += 0.25;
    if (p.baseSize === 30) {
      p.size = p.baseSize + Math.abs(Math.sin(p.beatPhase)) * 15;
      p.alpha = Math.sin(t * Math.PI);
    } else {
      p.size = p.baseSize + t * 50;
      p.alpha = (1 - t) * 0.5;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BeatParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.baseSize === 30) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
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
