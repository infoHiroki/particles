/**
 * Wave エフェクト
 * 波 + 揺れ + 伝播
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#0088ff', '#00aaff', '#00ccff'];

interface WaveParticle extends Particle {
  type: 'wave';
  radius: number; maxRadius: number; phase: number; amplitude: number; color: string;
}

export const waveEffect: Effect = {
  config: { name: 'wave', description: '波 + 揺れ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: WaveParticle[] = [];
    for (let i = 0; i < 5; i++) {
      particles.push({
        id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 50 + i * 10,
        delay: i * 8, alpha: 0, radius: 10, maxRadius: 80 + i * 20,
        phase: random(0, Math.PI * 2), amplitude: 5 + i * 2,
        color: DEFAULT_COLORS[i % 3],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WaveParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.radius = 10 + (p.maxRadius - 10) * easeOutCubic(t);
    p.phase += 0.2;
    p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WaveParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2; a += 0.1) {
      const r = p.radius + Math.sin(a * 6 + p.phase) * p.amplitude;
      const px = p.x + Math.cos(a) * r;
      const py = p.y + Math.sin(a) * r;
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.stroke();
    ctx.restore();
  },
};
