/**
 * Alert エフェクト
 * 警告 + 点滅 + 注意
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff4444', '#ff6666', '#ff8888'];

interface AlertParticle extends Particle {
  type: 'triangle' | 'ring' | 'flash';
  size: number;
  pulsePhase: number;
  color: string;
}

export const alertEffect: Effect = {
  config: { name: 'alert', description: '警告 + 点滅', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: AlertParticle[] = [];

    // Warning triangle
    particles.push({
      id: generateId(), type: 'triangle', x, y, progress: 0, maxProgress: 60,
      alpha: 0, size: 35, pulsePhase: 0, color: DEFAULT_COLORS[0],
    });

    // Pulsing rings
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 50,
        delay: i * 12, alpha: 0, size: 30, pulsePhase: 0, color: DEFAULT_COLORS[1],
      });
    }

    // Flash particles
    const flashCount = Math.floor(8 * intensity);
    for (let i = 0; i < flashCount; i++) {
      particles.push({
        id: generateId(), type: 'flash', x, y, progress: 0, maxProgress: 40,
        delay: random(0, 30), alpha: 0, size: random(3, 6), pulsePhase: random(0, Math.PI * 2),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as AlertParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    p.pulsePhase += 0.2;

    if (p.type === 'triangle') {
      p.alpha = (Math.sin(p.pulsePhase) > 0 ? 1 : 0.4) * (t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1);
    } else if (p.type === 'ring') {
      p.size = 30 + t * 40;
      p.alpha = (1 - t) * 0.6;
    } else {
      p.alpha = Math.abs(Math.sin(p.pulsePhase)) * (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as AlertParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'triangle') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;

      // Warning triangle
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.lineTo(p.x + p.size * 0.9, p.y + p.size * 0.5);
      ctx.lineTo(p.x - p.size * 0.9, p.y + p.size * 0.5);
      ctx.closePath();
      ctx.fill();

      // Exclamation mark
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${p.size * 0.8}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', p.x, p.y);
    } else if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const angle = p.pulsePhase;
      const dist = 40 + Math.sin(p.pulsePhase * 2) * 10;
      const px = p.x + Math.cos(angle) * dist;
      const py = p.y + Math.sin(angle) * dist;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
