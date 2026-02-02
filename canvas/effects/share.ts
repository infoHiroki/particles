/**
 * Share エフェクト
 * 共有 + 拡散 + 接続
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#44aaff', '#66bbff', '#88ccff'];

interface ShareParticle extends Particle {
  type: 'node' | 'line' | 'pulse';
  size: number;
  angle: number;
  targetAngle: number;
  radius: number;
  color: string;
}

export const shareEffect: Effect = {
  config: { name: 'share', description: '共有 + 拡散', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ShareParticle[] = [];

    // Central node
    particles.push({
      id: generateId(), type: 'node', x, y, progress: 0, maxProgress: 55,
      alpha: 0, size: 12, angle: 0, targetAngle: 0, radius: 0, color: DEFAULT_COLORS[0],
    });

    // Outer nodes with lines
    const nodeCount = 3;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
      particles.push({
        id: generateId(), type: 'line', x, y, progress: 0, maxProgress: 45,
        delay: 5 + i * 5, alpha: 0, size: 40, angle, targetAngle: 0, radius: 0,
        color: DEFAULT_COLORS[1],
      });
      particles.push({
        id: generateId(), type: 'node', x: x + Math.cos(angle) * 40, y: y + Math.sin(angle) * 40,
        progress: 0, maxProgress: 50, delay: 10 + i * 5, alpha: 0, size: 8,
        angle, targetAngle: 0, radius: 40, color: DEFAULT_COLORS[2],
      });
    }

    // Pulse waves
    const pulseCount = Math.floor(4 * intensity);
    for (let i = 0; i < pulseCount; i++) {
      particles.push({
        id: generateId(), type: 'pulse', x, y, progress: 0, maxProgress: 40,
        delay: 15 + i * 10, alpha: 0, size: 15, angle: 0, targetAngle: 0, radius: 0,
        color: DEFAULT_COLORS[0],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ShareParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'node') {
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
    } else if (p.type === 'line') {
      p.alpha = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1;
    } else {
      p.size = 15 + t * 50;
      p.alpha = (1 - t) * 0.5;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ShareParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'node') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'line') {
      const endX = p.x + Math.cos(p.angle) * p.size;
      const endY = p.y + Math.sin(p.angle) * p.size;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
