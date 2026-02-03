/**
 * Gem2 エフェクト
 * ジェム2 + 宝石カット + 虹色
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0055', '#00ff88', '#0088ff'];
interface Gem2Particle extends Particle { type: 'cut'; size: number; rotation: number; sparkle: number; hue: number; color: string; }
export const gem2Effect: Effect = {
  config: { name: 'gem2', description: 'ジェム2 + 宝石カット', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Gem2Particle[] = [];
    const count = Math.floor(10 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(15, 50);
      particles.push({ id: generateId(), type: 'cut', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, size: random(8, 14), rotation: random(0, Math.PI * 2), sparkle: 0, hue: random(0, 360), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Gem2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.hue += 2;
    p.rotation += 0.025;
    p.sparkle = Math.sin(t * Math.PI * 6) * 0.5 + 0.5;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Gem2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = `hsl(${p.hue}, 80%, 60%)`;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.lineTo(p.size * 0.8, 0);
    ctx.lineTo(0, p.size * 0.7);
    ctx.lineTo(-p.size * 0.8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${p.sparkle * 0.6})`;
    ctx.beginPath();
    ctx.moveTo(0, -p.size * 0.7);
    ctx.lineTo(p.size * 0.3, -p.size * 0.1);
    ctx.lineTo(-p.size * 0.3, -p.size * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
