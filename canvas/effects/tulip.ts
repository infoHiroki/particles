/**
 * Tulip エフェクト
 * チューリップ + 春 + カラフル
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4466', '#ffaa44', '#ff66aa'];
interface TulipParticle extends Particle { type: 'petal' | 'stem' | 'leaf'; size: number; petalIndex: number; color: string; }
export const tulipEffect: Effect = {
  config: { name: 'tulip', description: 'チューリップ + 春', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TulipParticle[] = [];
    particles.push({ id: generateId(), type: 'stem', x, y: y + 15, progress: 0, maxProgress: 60, alpha: 0, size: 35, petalIndex: 0, color: '#44aa44' });
    const colors = [DEFAULT_COLORS[Math.floor(random(0, 3))]];
    for (let i = 0; i < 5; i++) {
      particles.push({ id: generateId(), type: 'petal', x, y: y - 10, progress: 0, maxProgress: 55, delay: 5 + i * 2, alpha: 0, size: 18, petalIndex: i, color: colors[0] });
    }
    particles.push({ id: generateId(), type: 'leaf', x: x - 8, y: y + 25, progress: 0, maxProgress: 55, delay: 10, alpha: 0, size: 20, petalIndex: -1, color: '#44aa44' });
    particles.push({ id: generateId(), type: 'leaf', x: x + 8, y: y + 28, progress: 0, maxProgress: 55, delay: 12, alpha: 0, size: 18, petalIndex: 1, color: '#44aa44' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TulipParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TulipParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'stem') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size * 0.7);
      ctx.lineTo(p.x, p.y + p.size * 0.3);
      ctx.stroke();
    } else if (p.type === 'petal') {
      ctx.translate(p.x, p.y);
      const angle = (p.petalIndex / 5) * Math.PI - Math.PI / 2;
      const spread = 0.4;
      ctx.rotate(angle * spread);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-p.size * 0.3, -p.size * 0.5, 0, -p.size);
      ctx.quadraticCurveTo(p.size * 0.3, -p.size * 0.5, 0, 0);
      ctx.fill();
    } else {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.petalIndex * 0.3);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(p.size * 0.3, p.size * 0.3, 0, p.size);
      ctx.quadraticCurveTo(-p.size * 0.2, p.size * 0.5, 0, 0);
      ctx.fill();
    }
    ctx.restore();
  },
};
