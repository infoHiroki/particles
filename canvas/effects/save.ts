/**
 * Save エフェクト
 * 保存 + 完了 + 確認
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#44dd88', '#66eeaa', '#88ffcc'];

interface SaveParticle extends Particle {
  type: 'disk' | 'arrow' | 'sparkle';
  size: number;
  currentY: number;
  vy: number;
  drawProgress: number;
  color: string;
}

export const saveEffect: Effect = {
  config: { name: 'save', description: '保存 + 完了', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SaveParticle[] = [];

    // Disk icon
    particles.push({
      id: generateId(), type: 'disk', x, y, progress: 0, maxProgress: 50,
      alpha: 0, size: 28, currentY: y, vy: 0, drawProgress: 0, color: DEFAULT_COLORS[0],
    });

    // Download arrow
    particles.push({
      id: generateId(), type: 'arrow', x, y: y - 20, progress: 0, maxProgress: 35,
      delay: 5, alpha: 0, size: 12, currentY: y - 20, vy: 2, drawProgress: 0,
      color: DEFAULT_COLORS[0],
    });

    // Completion sparkles
    const sparkleCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'sparkle', x: x + Math.cos(angle) * random(25, 45),
        y: y + Math.sin(angle) * random(25, 45), progress: 0, maxProgress: 35,
        delay: random(20, 40), alpha: 0, size: random(2, 4), currentY: y, vy: 0,
        drawProgress: 0, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SaveParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'disk') {
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
    } else if (p.type === 'arrow') {
      p.currentY += p.vy;
      if (p.currentY > p.y + 10) p.currentY = p.y + 10;
      p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7;
    } else {
      p.alpha = Math.abs(Math.sin(p.progress * 0.3)) * (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SaveParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'disk') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;

      // Floppy disk shape
      ctx.beginPath();
      ctx.roundRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size, 3);
      ctx.stroke();

      // Label area
      ctx.fillStyle = p.color + '40';
      ctx.fillRect(p.x - p.size * 0.35, p.y - p.size * 0.1, p.size * 0.7, p.size * 0.35);

      // Metal slider
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size * 0.2, p.y - p.size * 0.4, p.size * 0.4, p.size * 0.2);
    } else if (p.type === 'arrow') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(p.x, p.currentY + p.size);
      ctx.lineTo(p.x - p.size * 0.6, p.currentY);
      ctx.lineTo(p.x - p.size * 0.2, p.currentY);
      ctx.lineTo(p.x - p.size * 0.2, p.currentY - p.size);
      ctx.lineTo(p.x + p.size * 0.2, p.currentY - p.size);
      ctx.lineTo(p.x + p.size * 0.2, p.currentY);
      ctx.lineTo(p.x + p.size * 0.6, p.currentY);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
