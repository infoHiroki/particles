/**
 * Score エフェクト
 * スコア数値 + 上昇 + 輝き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#00ff88', '#44ffaa', '#88ffcc'];

interface ScoreParticle extends Particle {
  type: 'number' | 'plus' | 'sparkle';
  size: number;
  currentX: number;
  currentY: number;
  vy: number;
  color: string;
  value: number;
}

export const scoreEffect: Effect = {
  config: { name: 'score', description: 'スコア + 上昇', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ScoreParticle[] = [];
    const value = (options.value as number) ?? Math.floor(random(100, 1000));

    // Plus sign
    particles.push({
      id: generateId(), type: 'plus', x: x - 30, y, progress: 0, maxProgress: 45,
      alpha: 0, size: 20, currentX: x - 30, currentY: y, vy: -1.5,
      color: DEFAULT_COLORS[0], value: 0,
    });

    // Score number
    particles.push({
      id: generateId(), type: 'number', x, y, progress: 0, maxProgress: 50,
      alpha: 0, size: 28, currentX: x, currentY: y, vy: -2,
      color: DEFAULT_COLORS[0], value,
    });

    // Sparkles
    const count = Math.floor(6 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({
        id: generateId(), type: 'sparkle', x, y, progress: 0, maxProgress: 30,
        delay: random(0, 10), alpha: 0, size: random(2, 4),
        currentX: x + random(-40, 40), currentY: y + random(-20, 20),
        vy: -random(1, 2), color: '#ffffff', value: 0,
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ScoreParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    p.currentY += p.vy;
    if (p.type === 'sparkle') {
      p.alpha = (1 - t) * Math.abs(Math.sin(p.progress * 0.5));
    } else {
      p.alpha = t < 0.15 ? t / 0.15 : t > 0.7 ? (1 - t) / 0.3 : 1;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ScoreParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 6;

    if (p.type === 'number') {
      ctx.font = `bold ${p.size}px Arial`;
      ctx.fillStyle = p.color;
      ctx.textAlign = 'left';
      ctx.fillText(String(p.value), p.currentX, p.currentY);
    } else if (p.type === 'plus') {
      ctx.font = `bold ${p.size}px Arial`;
      ctx.fillStyle = p.color;
      ctx.textAlign = 'center';
      ctx.fillText('+', p.currentX, p.currentY);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
