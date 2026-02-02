/**
 * Confirm エフェクト
 * 確認 + チェック + 承認
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#44ff88', '#66ffaa', '#88ffcc'];

interface ConfirmParticle extends Particle {
  type: 'check' | 'circle' | 'sparkle';
  size: number;
  drawProgress: number;
  color: string;
}

export const confirmEffect: Effect = {
  config: { name: 'confirm', description: '確認 + チェック', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ConfirmParticle[] = [];

    // Circle
    particles.push({
      id: generateId(), type: 'circle', x, y, progress: 0, maxProgress: 40,
      alpha: 0, size: 35, drawProgress: 0, color: DEFAULT_COLORS[0],
    });

    // Check mark
    particles.push({
      id: generateId(), type: 'check', x, y, progress: 0, maxProgress: 50,
      delay: 10, alpha: 0, size: 20, drawProgress: 0, color: DEFAULT_COLORS[0],
    });

    // Sparkles
    const sparkleCount = Math.floor(12 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'sparkle', x: x + Math.cos(angle) * random(30, 50),
        y: y + Math.sin(angle) * random(30, 50), progress: 0, maxProgress: 35,
        delay: random(15, 35), alpha: 0, size: random(2, 4), drawProgress: 0,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ConfirmParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'circle') {
      p.drawProgress = Math.min(t * 2, 1);
      p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    } else if (p.type === 'check') {
      p.drawProgress = Math.min(t * 1.5, 1);
      p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    } else {
      p.alpha = Math.abs(Math.sin(p.progress * 0.3)) * (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ConfirmParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'circle') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p.drawProgress);
      ctx.stroke();
    } else if (p.type === 'check') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 5;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const checkPoints = [
        { x: p.x - p.size * 0.5, y: p.y },
        { x: p.x - p.size * 0.1, y: p.y + p.size * 0.4 },
        { x: p.x + p.size * 0.6, y: p.y - p.size * 0.4 },
      ];

      ctx.beginPath();
      if (p.drawProgress < 0.5) {
        const prog = p.drawProgress * 2;
        ctx.moveTo(checkPoints[0].x, checkPoints[0].y);
        ctx.lineTo(
          checkPoints[0].x + (checkPoints[1].x - checkPoints[0].x) * prog,
          checkPoints[0].y + (checkPoints[1].y - checkPoints[0].y) * prog
        );
      } else {
        const prog = (p.drawProgress - 0.5) * 2;
        ctx.moveTo(checkPoints[0].x, checkPoints[0].y);
        ctx.lineTo(checkPoints[1].x, checkPoints[1].y);
        ctx.lineTo(
          checkPoints[1].x + (checkPoints[2].x - checkPoints[1].x) * prog,
          checkPoints[1].y + (checkPoints[2].y - checkPoints[1].y) * prog
        );
      }
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
