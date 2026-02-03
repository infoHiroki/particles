/**
 * Diffraction エフェクト
 * 回折 + ディフラクション + 光の曲がり
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0000', '#00ff00', '#0000ff'];
interface DiffractionParticle extends Particle { type: 'band'; size: number; bandIndex: number; spread: number; color: string; }
export const diffractionEffect: Effect = {
  config: { name: 'diffraction', description: '回折 + ディフラクション', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DiffractionParticle[] = [];
    const bandCount = Math.floor(15 * intensity);
    for (let i = 0; i < bandCount; i++) {
      particles.push({ id: generateId(), type: 'band', x, y, progress: 0, maxProgress: 50, delay: Math.abs(i - bandCount / 2) * 2, alpha: 0, size: 40, bandIndex: i - bandCount / 2, spread: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DiffractionParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.spread = t * 30;
    p.alpha = Math.sin(t * Math.PI) * (1 - Math.abs(p.bandIndex) * 0.05);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DiffractionParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha * 0.5;
    ctx.fillStyle = p.color;
    const offsetX = p.bandIndex * 4 + p.bandIndex * p.spread * 0.1;
    ctx.fillRect(p.x + offsetX - 2, p.y - p.size / 2, 4, p.size);
    ctx.restore();
  },
};
