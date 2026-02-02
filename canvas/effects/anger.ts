/**
 * Anger エフェクト
 * 怒り + 炎 + 振動
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff2200', '#ff4400', '#ff6600'];

interface AngerParticle extends Particle {
  type: 'vein' | 'flame' | 'shake';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  angle: number;
  color: string;
}

export const angerEffect: Effect = {
  config: { name: 'anger', description: '怒り + 炎', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: AngerParticle[] = [];

    // Anger veins
    const veinCount = 4;
    for (let i = 0; i < veinCount; i++) {
      const angle = Math.PI / 4 + (i % 2) * Math.PI / 2;
      particles.push({
        id: generateId(), type: 'vein', x: x + (i < 2 ? -25 : 25), y: y - 30,
        progress: 0, maxProgress: 45, delay: i * 5, alpha: 0, size: 12,
        currentX: x + (i < 2 ? -25 : 25), currentY: y - 30, vx: 0, vy: 0,
        angle, color: DEFAULT_COLORS[0],
      });
    }

    // Rising flames
    const flameCount = Math.floor(12 * intensity);
    for (let i = 0; i < flameCount; i++) {
      particles.push({
        id: generateId(), type: 'flame', x, y, progress: 0, maxProgress: 40,
        delay: random(0, 25), alpha: 0, size: random(8, 16),
        currentX: x + random(-35, 35), currentY: y - 20 + random(-10, 10),
        vx: random(-0.5, 0.5), vy: -random(2, 4), angle: 0,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Shake indicator
    particles.push({
      id: generateId(), type: 'shake', x, y, progress: 0, maxProgress: 50,
      alpha: 0, size: 50, currentX: x, currentY: y, vx: 0, vy: 0, angle: 0,
      color: DEFAULT_COLORS[0],
    });

    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as AngerParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'vein') {
      p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7;
      p.size = 12 * (1 + t * 0.3);
    } else if (p.type === 'flame') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.size *= 0.97;
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    } else {
      p.currentX = p.x + Math.sin(p.progress * 2) * 5 * (1 - t);
      p.alpha = (t < 0.2 ? t / 0.2 : (1 - t) / 0.8) * 0.3;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as AngerParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'vein') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.currentX, p.currentY);
      ctx.lineTo(p.currentX + Math.cos(p.angle) * p.size, p.currentY + Math.sin(p.angle) * p.size);
      ctx.moveTo(p.currentX + Math.cos(p.angle) * p.size * 0.5, p.currentY + Math.sin(p.angle) * p.size * 0.5);
      ctx.lineTo(p.currentX + Math.cos(p.angle + 0.5) * p.size * 0.6, p.currentY + Math.sin(p.angle + 0.5) * p.size * 0.6);
      ctx.stroke();
    } else if (p.type === 'flame') {
      const g = ctx.createRadialGradient(p.currentX, p.currentY + p.size * 0.3, 0, p.currentX, p.currentY, p.size);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.3, '#ffff00');
      g.addColorStop(0.6, p.color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(p.currentX, p.currentY, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color + '60';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(p.currentX, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
