/**
 * Infinity2 エフェクト
 * インフィニティ2 + 無限 + 永遠
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#8844ff', '#aa66ff', '#cc88ff'];
interface Infinity2Particle extends Particle { type: 'trail'; size: number; t: number; speed: number; hue: number; color: string; }
export const infinity2Effect: Effect = {
  config: { name: 'infinity2', description: 'インフィニティ2 + 無限', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Infinity2Particle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'trail', x, y, progress: 0, maxProgress: 80, delay: i * 2, alpha: 0, size: random(3, 6), t: (i / count) * Math.PI * 2, speed: random(0.05, 0.08), hue: (i / count) * 360, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Infinity2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.t += p.speed;
    p.hue += 1;
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Infinity2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const scale = 40;
    const px = p.x + Math.sin(p.t) * scale;
    const py = p.y + Math.sin(p.t * 2) * scale * 0.5;
    ctx.fillStyle = `hsl(${p.hue}, 70%, 60%)`;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
