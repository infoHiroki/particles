/**
 * Tsunami エフェクト
 * 津波 + 波 + 力
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488cc', '#66aadd', '#88ccff'];
interface TsunamiParticle extends Particle { type: 'wave' | 'foam' | 'spray'; size: number; vx: number; vy: number; wavePhase: number; color: string; }
export const tsunamiEffect: Effect = {
  config: { name: 'tsunami', description: '津波 + 波', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TsunamiParticle[] = [];
    for (let i = 0; i < 3; i++) {
      particles.push({ id: generateId(), type: 'wave', x: x - 30 + i * 15, y: y + i * 10, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 50 - i * 10, vx: 2 - i * 0.3, vy: 0, wavePhase: i * 0.5, color: DEFAULT_COLORS[i] });
    }
    const foamCount = Math.floor(8 * intensity);
    for (let i = 0; i < foamCount; i++) {
      particles.push({ id: generateId(), type: 'foam', x: x + random(-30, 20), y: y + random(-20, 10), progress: 0, maxProgress: 45, delay: random(5, 20), alpha: 0, size: random(4, 8), vx: random(1, 2.5), vy: random(-0.5, 0.5), wavePhase: 0, color: '#ffffff' });
    }
    const sprayCount = Math.floor(6 * intensity);
    for (let i = 0; i < sprayCount; i++) {
      particles.push({ id: generateId(), type: 'spray', x: x + random(-20, 10), y: y + random(-30, -10), progress: 0, maxProgress: 40, delay: random(8, 25), alpha: 0, size: random(2, 4), vx: random(0.5, 1.5), vy: random(-1, 0.5), wavePhase: 0, color: '#aaddff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TsunamiParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'wave') {
      p.x += p.vx;
      p.wavePhase += 0.15;
    } else {
      p.x += p.vx;
      p.y += p.vy;
      if (p.type === 'spray') p.vy += 0.05;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.7 ? (1 - t) / 0.3 : (p.type === 'wave' ? 0.8 : 0.6);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TsunamiParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'wave') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size, p.y + p.size * 0.5);
      const curl = Math.sin(p.wavePhase) * 10;
      ctx.quadraticCurveTo(p.x - p.size * 0.3, p.y - p.size + curl, p.x + p.size * 0.3, p.y - p.size * 0.8);
      ctx.quadraticCurveTo(p.x + p.size * 0.5, p.y - p.size * 0.3, p.x + p.size * 0.3, p.y);
      ctx.quadraticCurveTo(p.x, p.y + p.size * 0.3, p.x - p.size, p.y + p.size * 0.5);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
