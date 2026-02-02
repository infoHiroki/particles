/**
 * Slash エフェクト
 * 斬撃 + 軌跡 + 衝撃
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ffffff', '#aaddff', '#88ccff'];

interface SlashParticle extends Particle {
  type: 'slash' | 'spark'; angle: number; length: number; progress2: number;
  currentX: number; currentY: number; size: number; color: string;
}

export const slashEffect: Effect = {
  config: { name: 'slash', description: '斬撃 + 軌跡', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SlashParticle[] = [];
    const angle = (options.angle as number) ?? -Math.PI / 4;
    particles.push({
      id: generateId(), type: 'slash', x, y, progress: 0, maxProgress: 20, alpha: 0,
      angle, length: 120, progress2: 0, currentX: x, currentY: y, size: 4, color: '#ffffff',
    });
    const sparkCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const sparkAngle = angle + random(-0.5, 0.5);
      particles.push({
        id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 25 + random(0, 15),
        delay: random(0, 5), alpha: 0, angle: sparkAngle, length: random(20, 50), progress2: 0,
        currentX: x, currentY: y, size: random(1, 3), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SlashParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'slash') {
      p.progress2 = easeOutCubic(t);
      p.alpha = t < 0.3 ? 1 : 1 - (t - 0.3) / 0.7;
    } else {
      const dist = p.length * easeOutCubic(t);
      p.currentX = p.x + Math.cos(p.angle) * dist;
      p.currentY = p.y + Math.sin(p.angle) * dist;
      p.alpha = 1 - easeOutCubic(t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SlashParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    if (p.type === 'slash') {
      const startX = p.x - Math.cos(p.angle) * p.length * 0.5 * p.progress2;
      const startY = p.y - Math.sin(p.angle) * p.length * 0.5 * p.progress2;
      const endX = p.x + Math.cos(p.angle) * p.length * 0.5 * p.progress2;
      const endY = p.y + Math.sin(p.angle) * p.length * 0.5 * p.progress2;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = p.size; ctx.lineCap = 'round';
      ctx.shadowColor = '#aaddff'; ctx.shadowBlur = 15;
      ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.stroke();
    } else {
      ctx.fillStyle = p.color; ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
};
