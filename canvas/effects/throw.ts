/**
 * Throw エフェクト
 * 投げ + 軌跡 + 風圧
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffaa44', '#ff8822', '#ff6600'];

interface ThrowParticle extends Particle {
  type: 'arc' | 'wind' | 'trail';
  size: number;
  currentX: number;
  currentY: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
}

export const throwEffect: Effect = {
  config: { name: 'throw', description: '投げ + 軌跡', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const direction = (options.direction as number) ?? 1;
    const particles: ThrowParticle[] = [];

    const endX = x + direction * 100;
    const endY = y + 50;

    // Main arc
    particles.push({
      id: generateId(), type: 'arc', x, y, progress: 0, maxProgress: 30,
      alpha: 0, size: 3, currentX: x, currentY: y,
      startX: x, startY: y, endX, endY, color: DEFAULT_COLORS[0],
    });

    // Wind lines
    const windCount = Math.floor(8 * intensity);
    for (let i = 0; i < windCount; i++) {
      const t = random(0.2, 0.8);
      const arcX = x + (endX - x) * t;
      const arcY = y + (endY - y) * t - Math.sin(t * Math.PI) * 40;
      particles.push({
        id: generateId(), type: 'wind', x: arcX, y: arcY, progress: 0, maxProgress: 20,
        delay: t * 15, alpha: 0, size: random(20, 35),
        currentX: arcX - direction * random(10, 30), currentY: arcY + random(-10, 10),
        startX: x, startY: y, endX, endY, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Trail particles
    const trailCount = Math.floor(12 * intensity);
    for (let i = 0; i < trailCount; i++) {
      const t = random(0.1, 0.9);
      const arcX = x + (endX - x) * t;
      const arcY = y + (endY - y) * t - Math.sin(t * Math.PI) * 40;
      particles.push({
        id: generateId(), type: 'trail', x: arcX, y: arcY, progress: 0, maxProgress: 25,
        delay: t * 20, alpha: 0, size: random(2, 5),
        currentX: arcX + random(-10, 10), currentY: arcY + random(-10, 10),
        startX: x, startY: y, endX, endY, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ThrowParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'arc') {
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    } else if (p.type === 'wind') {
      p.currentX += (p.endX - p.startX) * 0.05;
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8 * 0.7;
    } else {
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ThrowParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'arc') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(p.startX, p.startY);
      const cpX = (p.startX + p.endX) / 2;
      const cpY = Math.min(p.startY, p.endY) - 50;
      ctx.quadraticCurveTo(cpX, cpY, p.endX, p.endY);
      ctx.stroke();
    } else if (p.type === 'wind') {
      const g = ctx.createLinearGradient(p.currentX - p.size, p.currentY, p.currentX, p.currentY);
      g.addColorStop(0, 'transparent');
      g.addColorStop(1, p.color);
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.currentX - p.size, p.currentY);
      ctx.lineTo(p.currentX, p.currentY);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
