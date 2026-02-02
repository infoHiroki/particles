/**
 * Flower エフェクト
 * 花 + 花びら + 美しい
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff88aa', '#ffaacc', '#ffccdd'];
interface FlowerParticle extends Particle { type: 'petal' | 'center' | 'falling'; size: number; angle: number; vx: number; vy: number; rotation: number; color: string; }
export const flowerEffect: Effect = {
  config: { name: 'flower', description: '花 + 花びら', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FlowerParticle[] = [];
    particles.push({ id: generateId(), type: 'center', x, y, progress: 0, maxProgress: 60, delay: 5, alpha: 0, size: 10, angle: 0, vx: 0, vy: 0, rotation: 0, color: '#ffdd44' });
    const petalCount = Math.floor(6 * intensity);
    for (let i = 0; i < petalCount; i++) {
      const a = (i / petalCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'petal', x, y, progress: 0, maxProgress: 55, delay: i * 2, alpha: 0, size: 18, angle: a, vx: 0, vy: 0, rotation: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const fallingCount = Math.floor(4 * intensity);
    for (let i = 0; i < fallingCount; i++) {
      particles.push({ id: generateId(), type: 'falling', x: x + random(-20, 20), y: y + random(-10, 10), progress: 0, maxProgress: 50, delay: random(20, 40), alpha: 0, size: random(6, 10), angle: 0, vx: random(-0.5, 0.5), vy: random(0.5, 1.2), rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FlowerParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'falling') {
      p.x += p.vx + Math.sin(p.progress * 0.15) * 0.3;
      p.y += p.vy;
      p.rotation += 0.04;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FlowerParticle;
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
      ctx.ellipse(p.size * 0.6, 0, p.size * 0.3, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.4, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
