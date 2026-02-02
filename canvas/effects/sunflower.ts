/**
 * Sunflower エフェクト
 * ひまわり + 夏 + 太陽
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffdd00', '#ffcc00', '#885522'];
interface SunflowerParticle extends Particle { type: 'petal' | 'center' | 'seed'; size: number; angle: number; color: string; }
export const sunflowerEffect: Effect = {
  config: { name: 'sunflower', description: 'ひまわり + 夏', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SunflowerParticle[] = [];
    particles.push({ id: generateId(), type: 'center', x, y, progress: 0, maxProgress: 60, delay: 10, alpha: 0, size: 18, angle: 0, color: DEFAULT_COLORS[2] });
    const petalCount = Math.floor(14 * intensity);
    for (let i = 0; i < petalCount; i++) {
      const a = (i / petalCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'petal', x, y, progress: 0, maxProgress: 55, delay: i * 1.5, alpha: 0, size: 20, angle: a, color: i % 2 === 0 ? DEFAULT_COLORS[0] : DEFAULT_COLORS[1] });
    }
    const seedCount = Math.floor(12 * intensity);
    for (let i = 0; i < seedCount; i++) {
      const a = random(0, Math.PI * 2);
      const d = random(3, 12);
      particles.push({ id: generateId(), type: 'seed', x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, progress: 0, maxProgress: 50, delay: 15 + random(0, 10), alpha: 0, size: random(2, 3), angle: 0, color: '#222222' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SunflowerParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SunflowerParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'center') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'petal') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.size * 0.7, 0, p.size * 0.2, p.size * 0.5, 0, 0, Math.PI * 2);
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
