/**
 * Tree エフェクト
 * 木 + 葉 + 自然
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aa44', '#66cc66', '#88dd88'];
interface TreeParticle extends Particle { type: 'trunk' | 'leaf' | 'falling'; size: number; vx: number; vy: number; rotation: number; color: string; }
export const treeEffect: Effect = {
  config: { name: 'tree', description: '木 + 自然', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TreeParticle[] = [];
    particles.push({ id: generateId(), type: 'trunk', x, y: y + 20, progress: 0, maxProgress: 65, alpha: 0, size: 25, vx: 0, vy: 0, rotation: 0, color: '#885533' });
    const leafCount = Math.floor(15 * intensity);
    for (let i = 0; i < leafCount; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(10, 35);
      particles.push({ id: generateId(), type: 'leaf', x: x + Math.cos(angle) * dist, y: y - 15 + Math.sin(angle) * dist * 0.6, progress: 0, maxProgress: 60, delay: random(3, 15), alpha: 0, size: random(8, 14), vx: 0, vy: 0, rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    const fallingCount = Math.floor(5 * intensity);
    for (let i = 0; i < fallingCount; i++) {
      particles.push({ id: generateId(), type: 'falling', x: x + random(-30, 30), y: y + random(-25, 0), progress: 0, maxProgress: 55, delay: random(15, 40), alpha: 0, size: random(5, 8), vx: random(-0.3, 0.3), vy: random(0.5, 1.2), rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TreeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'falling') {
      p.x += p.vx + Math.sin(p.progress * 0.1) * 0.3;
      p.y += p.vy;
      p.rotation += 0.05;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TreeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'trunk') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size * 0.15, p.y);
      ctx.lineTo(p.x - p.size * 0.25, p.y + p.size);
      ctx.lineTo(p.x + p.size * 0.25, p.y + p.size);
      ctx.lineTo(p.x + p.size * 0.15, p.y);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
