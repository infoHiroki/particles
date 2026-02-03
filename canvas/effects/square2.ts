/**
 * Square2 エフェクト
 * 矩形波 + デジタル波 + パルス
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4488', '#ff66aa', '#ff88cc'];
interface Square2Particle extends Particle { type: 'wave'; size: number; phase: number; amplitude: number; color: string; }
export const square2Effect: Effect = {
  config: { name: 'square2', description: '矩形波 + デジタル波', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Square2Particle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'wave', x, y: y + (i - 1) * 25, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 2, phase: 0, amplitude: random(15, 20), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Square2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.1;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Square2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.beginPath();
    let lastY = p.y;
    for (let i = 0; i <= 40; i++) {
      const px = p.x - 60 + i * 3;
      const val = Math.sin(p.phase + i * 0.3);
      const py = p.y + (val > 0 ? -p.amplitude : p.amplitude);
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        if ((val > 0) !== (Math.sin(p.phase + (i - 1) * 0.3) > 0)) {
          ctx.lineTo(px, lastY);
        }
        ctx.lineTo(px, py);
      }
      lastY = py;
    }
    ctx.stroke();
    ctx.restore();
  },
};
