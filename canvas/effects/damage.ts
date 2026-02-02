/**
 * Damage エフェクト
 * ダメージ数値 + 衝撃 + 振動
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ff4444', '#ff6666', '#ff8888'];

interface DamageParticle extends Particle {
  type: 'number' | 'impact';
  size: number;
  currentX: number;
  currentY: number;
  vy: number;
  shake: number;
  color: string;
  value: number;
}

export const damageEffect: Effect = {
  config: { name: 'damage', description: 'ダメージ + 衝撃', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DamageParticle[] = [];
    const value = (options.value as number) ?? Math.floor(random(10, 100));

    // Main number
    particles.push({
      id: generateId(), type: 'number', x, y, progress: 0, maxProgress: 40,
      alpha: 0, size: 24 + intensity * 8, currentX: x, currentY: y, vy: -3,
      shake: 0, color: DEFAULT_COLORS[0], value,
    });

    // Impact particles
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'impact', x, y, progress: 0, maxProgress: 20,
        alpha: 0, size: random(3, 6), currentX: x, currentY: y,
        vy: Math.sin(angle) * random(3, 6), shake: Math.cos(angle) * random(3, 6),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))], value: 0,
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DamageParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'number') {
      p.currentY += p.vy;
      p.vy += 0.1;
      p.shake = Math.sin(p.progress * 2) * (1 - t) * 3;
      p.alpha = t < 0.1 ? t / 0.1 : t > 0.7 ? (1 - t) / 0.3 : 1;
    } else {
      p.currentX += p.shake;
      p.currentY += p.vy;
      p.alpha = 1 - easeOutCubic(t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DamageParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'number') {
      ctx.font = `bold ${p.size}px Arial`;
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';
      ctx.fillText(String(p.value), p.currentX + p.shake, p.currentY);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
