/**
 * Fern エフェクト
 * シダ + 森 + 自然
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#228833', '#33aa44', '#44bb55'];
interface FernParticle extends Particle { type: 'stem' | 'frond' | 'spore'; size: number; frondIndex: number; side: number; color: string; }
export const fernEffect: Effect = {
  config: { name: 'fern', description: 'シダ + 森', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FernParticle[] = [];
    particles.push({ id: generateId(), type: 'stem', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 40, frondIndex: 0, side: 0, color: '#226633' });
    const frondCount = Math.floor(12 * intensity);
    for (let i = 0; i < frondCount; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const yOffset = (i / frondCount) * 35 - 15;
      particles.push({ id: generateId(), type: 'frond', x, y: y + yOffset, progress: 0, maxProgress: 55, delay: 3 + i * 2, alpha: 0, size: 15 - Math.abs(yOffset) * 0.2, frondIndex: i, side, color: DEFAULT_COLORS[i % 3] });
    }
    const sporeCount = Math.floor(5 * intensity);
    for (let i = 0; i < sporeCount; i++) {
      particles.push({ id: generateId(), type: 'spore', x: x + random(-20, 20), y: y + random(-10, 20), progress: 0, maxProgress: 45, delay: random(25, 40), alpha: 0, size: random(1, 2), frondIndex: 0, side: 0, color: '#88aa44' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FernParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FernParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'stem') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + p.size * 0.5);
      ctx.quadraticCurveTo(p.x, p.y - p.size * 0.3, p.x, p.y - p.size * 0.4);
      ctx.stroke();
    } else if (p.type === 'frond') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.side * 0.3);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(p.side * p.size * 0.5, -p.size * 0.1, p.side * p.size, 0);
      ctx.stroke();
      ctx.fillStyle = p.color;
      for (let i = 0; i < 5; i++) {
        const fx = p.side * (i + 1) * (p.size / 5);
        const fy = Math.sin((i + 1) * 0.3) * -2;
        ctx.beginPath();
        ctx.ellipse(fx, fy, 2, 4, p.side * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
