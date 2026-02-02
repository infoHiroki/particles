/**
 * Clover エフェクト
 * クローバー + 幸運 + 緑
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aa44', '#55bb55', '#66cc66'];
interface CloverParticle extends Particle { type: 'leaf' | 'stem' | 'sparkle'; size: number; leafIndex: number; color: string; }
export const cloverEffect: Effect = {
  config: { name: 'clover', description: 'クローバー + 幸運', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CloverParticle[] = [];
    particles.push({ id: generateId(), type: 'stem', x, y: y + 10, progress: 0, maxProgress: 60, alpha: 0, size: 20, leafIndex: 0, color: '#338833' });
    const leafCount = random(0, 1) > 0.9 ? 4 : 3;
    for (let i = 0; i < leafCount; i++) {
      particles.push({ id: generateId(), type: 'leaf', x, y, progress: 0, maxProgress: 55, delay: 3 + i * 3, alpha: 0, size: 14, leafIndex: i, color: DEFAULT_COLORS[i % 3] });
    }
    if (leafCount === 4) {
      const sparkleCount = Math.floor(5 * intensity);
      for (let i = 0; i < sparkleCount; i++) {
        particles.push({ id: generateId(), type: 'sparkle', x: x + random(-20, 20), y: y + random(-20, 15), progress: 0, maxProgress: 40, delay: random(15, 35), alpha: 0, size: random(2, 4), leafIndex: 0, color: '#ffdd44' });
      }
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CloverParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'sparkle') {
      p.alpha = Math.abs(Math.sin(p.progress * 0.2)) * (1 - t);
    } else {
      p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CloverParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'stem') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo(p.x + 3, p.y + p.size * 0.5, p.x, p.y + p.size);
      ctx.stroke();
    } else if (p.type === 'leaf') {
      ctx.translate(p.x, p.y);
      const totalLeaves = p.leafIndex < 3 ? 3 : 4;
      const angle = (p.leafIndex / totalLeaves) * Math.PI * 2 - Math.PI / 2;
      ctx.rotate(angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size * 0.3, -p.size * 0.3, p.size, -p.size * 0.2, p.size * 0.7, 0);
      ctx.bezierCurveTo(p.size, p.size * 0.2, p.size * 0.3, p.size * 0.3, 0, 0);
      ctx.fill();
      ctx.strokeStyle = '#228822';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(p.size * 0.5, 0);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
