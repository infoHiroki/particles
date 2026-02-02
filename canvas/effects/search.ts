/**
 * Search エフェクト
 * 検索 + スキャン + 発見
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#88ccff'];

interface SearchParticle extends Particle {
  type: 'lens' | 'beam' | 'dot';
  size: number;
  angle: number;
  currentX: number;
  currentY: number;
  color: string;
}

export const searchEffect: Effect = {
  config: { name: 'search', description: '検索 + スキャン', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SearchParticle[] = [];

    // Magnifying glass
    particles.push({
      id: generateId(), type: 'lens', x, y, progress: 0, maxProgress: 60,
      alpha: 0, size: 30, angle: 0, currentX: x, currentY: y, color: DEFAULT_COLORS[0],
    });

    // Scanning beam
    particles.push({
      id: generateId(), type: 'beam', x, y, progress: 0, maxProgress: 55,
      delay: 5, alpha: 0, size: 50, angle: -Math.PI / 4, currentX: x, currentY: y,
      color: DEFAULT_COLORS[1],
    });

    // Scanning dots
    const dotCount = Math.floor(15 * intensity);
    for (let i = 0; i < dotCount; i++) {
      particles.push({
        id: generateId(), type: 'dot', x, y, progress: 0, maxProgress: 40,
        delay: random(10, 40), alpha: 0, size: random(2, 4),
        angle: random(0, Math.PI * 2), currentX: x + random(-40, 40),
        currentY: y + random(-40, 40), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SearchParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'lens') {
      p.currentX = p.x + Math.sin(p.progress * 0.1) * 15;
      p.currentY = p.y + Math.cos(p.progress * 0.15) * 10;
      p.alpha = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
    } else if (p.type === 'beam') {
      p.angle += 0.03;
      p.alpha = (t < 0.2 ? t / 0.2 : (1 - t) / 0.8) * 0.5;
    } else {
      p.alpha = Math.random() > 0.3 ? (1 - t) * 0.8 : 0;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SearchParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'lens') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;

      // Lens circle
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.stroke();

      // Handle
      const handleAngle = Math.PI / 4;
      ctx.beginPath();
      ctx.moveTo(
        p.currentX + Math.cos(handleAngle) * p.size,
        p.currentY + Math.sin(handleAngle) * p.size
      );
      ctx.lineTo(
        p.currentX + Math.cos(handleAngle) * (p.size + 20),
        p.currentY + Math.sin(handleAngle) * (p.size + 20)
      );
      ctx.stroke();
    } else if (p.type === 'beam') {
      const g = ctx.createLinearGradient(
        p.x, p.y,
        p.x + Math.cos(p.angle) * p.size,
        p.y + Math.sin(p.angle) * p.size
      );
      g.addColorStop(0, p.color);
      g.addColorStop(1, 'transparent');
      ctx.strokeStyle = g;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.size, p.y + Math.sin(p.angle) * p.size);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
