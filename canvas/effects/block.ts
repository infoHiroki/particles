/**
 * Block エフェクト
 * ブロック + 衝撃 + 火花
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffcc44', '#ffaa22', '#ff8800'];

interface BlockParticle extends Particle {
  type: 'shield' | 'spark' | 'ring';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  color: string;
}

export const blockEffect: Effect = {
  config: { name: 'block', description: 'ブロック + 衝撃', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BlockParticle[] = [];

    // Shield flash
    particles.push({
      id: generateId(), type: 'shield', x, y, progress: 0, maxProgress: 20,
      alpha: 0, size: 50, currentX: x, currentY: y, vx: 0, vy: 0,
      color: DEFAULT_COLORS[0],
    });

    // Impact ring
    particles.push({
      id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 25,
      alpha: 0, size: 20, currentX: x, currentY: y, vx: 0, vy: 0,
      color: DEFAULT_COLORS[1],
    });

    // Sparks
    const sparkCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(Math.PI * 0.3, Math.PI * 0.7);
      particles.push({
        id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 22,
        delay: random(0, 5), alpha: 0, size: random(2, 5),
        currentX: x, currentY: y,
        vx: Math.cos(angle) * random(5, 15), vy: Math.sin(angle) * random(5, 15),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BlockParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'shield') {
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8 * 0.8;
    } else if (p.type === 'ring') {
      p.size = 20 + t * 40;
      p.alpha = (1 - t) * 0.7;
    } else {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.vy += 0.2;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BlockParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'shield') {
      ctx.fillStyle = p.color + '60';
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.lineTo(p.x, p.y);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
