/**
 * Speaker エフェクト
 * スピーカー + 振動 + 音波
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#333333', '#666666', '#00aaff'];
interface SpeakerParticle extends Particle { type: 'cone' | 'wave'; size: number; phase: number; maxSize: number; color: string; }
export const speakerEffect: Effect = {
  config: { name: 'speaker', description: 'スピーカー + 振動', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SpeakerParticle[] = [];
    particles.push({ id: generateId(), type: 'cone', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 25, phase: 0, maxSize: 0, color: DEFAULT_COLORS[0] });
    const waveCount = Math.floor(6 * intensity);
    for (let i = 0; i < waveCount; i++) {
      particles.push({ id: generateId(), type: 'wave', x: x + 20, y, progress: 0, maxProgress: 40, delay: i * 8, alpha: 0, size: 10, phase: 0, maxSize: 40 + i * 10, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SpeakerParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.3;
    if (p.type === 'wave') {
      p.size = p.maxSize * t;
    }
    p.alpha = Math.sin(t * Math.PI) * (p.type === 'cone' ? 1 : 0.6);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SpeakerParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'cone') {
      const offset = Math.sin(p.phase) * 3;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x + offset, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = DEFAULT_COLORS[1];
      ctx.beginPath();
      ctx.arc(p.x + offset, p.y, p.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, -0.8, 0.8);
      ctx.stroke();
    }
    ctx.restore();
  },
};
