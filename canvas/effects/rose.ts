/**
 * Rose エフェクト
 * バラ + 愛 + ロマンチック
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#cc0033', '#dd1144', '#ee2255'];
interface RoseParticle extends Particle { type: 'petal' | 'center' | 'leaf' | 'falling'; size: number; layer: number; angle: number; vx: number; vy: number; rotation: number; color: string; }
export const roseEffect: Effect = {
  config: { name: 'rose', description: 'バラ + ロマンチック', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RoseParticle[] = [];
    for (let layer = 0; layer < 3; layer++) {
      const petalCount = 5 + layer * 2;
      for (let i = 0; i < petalCount; i++) {
        const a = (i / petalCount) * Math.PI * 2 + layer * 0.3;
        particles.push({ id: generateId(), type: 'petal', x, y, progress: 0, maxProgress: 55, delay: layer * 3 + i, alpha: 0, size: 12 - layer * 2, layer, angle: a, vx: 0, vy: 0, rotation: 0, color: DEFAULT_COLORS[layer] });
      }
    }
    particles.push({ id: generateId(), type: 'center', x, y, progress: 0, maxProgress: 55, delay: 12, alpha: 0, size: 5, layer: 0, angle: 0, vx: 0, vy: 0, rotation: 0, color: '#ffdd44' });
    particles.push({ id: generateId(), type: 'leaf', x: x - 15, y: y + 15, progress: 0, maxProgress: 50, delay: 15, alpha: 0, size: 12, layer: 0, angle: -0.5, vx: 0, vy: 0, rotation: 0, color: '#44aa44' });
    particles.push({ id: generateId(), type: 'leaf', x: x + 15, y: y + 18, progress: 0, maxProgress: 50, delay: 18, alpha: 0, size: 10, layer: 0, angle: 0.5, vx: 0, vy: 0, rotation: 0, color: '#44aa44' });
    const fallingCount = Math.floor(4 * intensity);
    for (let i = 0; i < fallingCount; i++) {
      particles.push({ id: generateId(), type: 'falling', x: x + random(-20, 20), y: y + random(-15, 5), progress: 0, maxProgress: 50, delay: random(20, 40), alpha: 0, size: random(5, 8), layer: 0, angle: 0, vx: random(-0.4, 0.4), vy: random(0.5, 1), rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RoseParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'falling') {
      p.x += p.vx + Math.sin(p.progress * 0.1) * 0.2;
      p.y += p.vy;
      p.rotation += 0.03;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RoseParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'petal') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      const dist = 5 + p.layer * 3;
      ctx.beginPath();
      ctx.ellipse(dist, 0, p.size * 0.4, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'center') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'leaf') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.3, p.size * 0.7, 0, 0, Math.PI * 2);
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
