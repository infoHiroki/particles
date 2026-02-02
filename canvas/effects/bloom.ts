/**
 * Bloom エフェクト
 * 花 + 開花 + 花びら
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ff88aa', '#ffaacc', '#ffccdd', '#ffffff'];

interface PetalParticle extends Particle {
  type: 'petal' | 'center'; size: number; angle: number; distance: number;
  rotation: number; currentX: number; currentY: number; color: string;
}

export const bloomEffect: Effect = {
  config: { name: 'bloom', description: '花 + 開花', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: PetalParticle[] = [];
    particles.push({
      id: generateId(), type: 'center', x, y, progress: 0, maxProgress: 50, alpha: 0,
      size: 8, angle: 0, distance: 0, rotation: 0, currentX: x, currentY: y, color: '#ffff88',
    });
    const petalCount = Math.floor(8 * intensity);
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'petal', x, y, progress: 0, maxProgress: 60, delay: random(0, 10),
        alpha: 0, size: random(12, 18), angle, distance: random(25, 40), rotation: angle,
        currentX: x, currentY: y, color: randomPick(colors.slice(0, 3)),
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PetalParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'center') {
      p.size = 8 * (t < 0.3 ? easeOutCubic(t / 0.3) : 1);
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1;
    } else {
      const eased = easeOutCubic(Math.min(t * 2, 1));
      p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
      p.currentY = p.y + Math.sin(p.angle) * p.distance * eased;
      p.alpha = t < 0.15 ? t / 0.15 : t > 0.7 ? (1 - t) / 0.3 : 1;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PetalParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    if (p.type === 'center') {
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.translate(p.currentX, p.currentY); ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
};
