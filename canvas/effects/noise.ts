/**
 * Noise エフェクト
 * ノイズ + 雑音 + 乱れ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#888888', '#aaaaaa', '#cccccc'];
interface NoiseParticle extends Particle { type: 'static'; size: number; gridX: number; gridY: number; brightness: number; color: string; }
export const noiseEffect: Effect = {
  config: { name: 'noise', description: 'ノイズ + 雑音', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: NoiseParticle[] = [];
    const gridSize = Math.floor(8 * intensity);
    const pixelSize = 5;
    for (let gx = -gridSize; gx <= gridSize; gx++) {
      for (let gy = -gridSize; gy <= gridSize; gy++) {
        particles.push({ id: generateId(), type: 'static', x, y, progress: 0, maxProgress: 40, delay: random(0, 10), alpha: 0, size: pixelSize, gridX: gx * pixelSize, gridY: gy * pixelSize, brightness: random(0, 1), color: DEFAULT_COLORS[0] });
      }
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as NoiseParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.brightness = random(0, 1);
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as NoiseParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const gray = Math.floor(p.brightness * 255);
    ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
    ctx.fillRect(p.x + p.gridX, p.y + p.gridY, p.size, p.size);
    ctx.restore();
  },
};
