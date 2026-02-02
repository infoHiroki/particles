/**
 * Surprise エフェクト
 * 驚き + 閃光 + 衝撃
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffff44', '#ffdd00', '#ffbb00'];

interface SurpriseParticle extends Particle {
  type: 'exclaim' | 'burst' | 'ring';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  color: string;
}

export const surpriseEffect: Effect = {
  config: { name: 'surprise', description: '驚き + 閃光', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SurpriseParticle[] = [];

    // Exclamation marks
    particles.push({
      id: generateId(), type: 'exclaim', x, y: y - 30, progress: 0, maxProgress: 40,
      alpha: 0, size: 30, currentX: x, currentY: y - 30, vx: 0, vy: -2,
      color: DEFAULT_COLORS[0],
    });

    // Expanding rings
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 35,
        delay: i * 5, alpha: 0, size: 20, currentX: x, currentY: y, vx: 0, vy: 0,
        color: DEFAULT_COLORS[i % 3],
      });
    }

    // Burst particles
    const burstCount = Math.floor(15 * intensity);
    for (let i = 0; i < burstCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(5, 12);
      particles.push({
        id: generateId(), type: 'burst', x, y, progress: 0, maxProgress: 30,
        delay: 5, alpha: 0, size: random(3, 6), currentX: x, currentY: y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SurpriseParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'exclaim') {
      p.currentY += p.vy;
      p.vy *= 0.95;
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    } else if (p.type === 'ring') {
      p.size = 20 + t * 60;
      p.alpha = (1 - t) * 0.6;
    } else {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SurpriseParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'exclaim') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.font = `bold ${p.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', p.currentX, p.currentY);
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
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
