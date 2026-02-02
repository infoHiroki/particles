/**
 * Signal エフェクト
 * 信号 + 電波 + 波紋
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#66ff66', '#88ff88', '#aaffaa'];

interface SignalParticle extends Particle {
  type: 'wave' | 'dot' | 'bar';
  size: number;
  angle: number;
  color: string;
}

export const signalEffect: Effect = {
  config: { name: 'signal', description: '信号 + 電波', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SignalParticle[] = [];

    // Signal waves
    for (let i = 0; i < 4; i++) {
      particles.push({
        id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 50,
        delay: i * 8, alpha: 0, size: 20 + i * 15, angle: 0, color: DEFAULT_COLORS[0],
      });
    }

    // Signal bars
    for (let i = 0; i < 4; i++) {
      particles.push({
        id: generateId(), type: 'bar', x: x - 25 + i * 15, y: y + 20,
        progress: 0, maxProgress: 55, delay: i * 5, alpha: 0,
        size: 10 + i * 8, angle: 0, color: DEFAULT_COLORS[1],
      });
    }

    // Dots
    const dotCount = Math.floor(8 * intensity);
    for (let i = 0; i < dotCount; i++) {
      const angle = random(-Math.PI * 0.6, Math.PI * 0.6) - Math.PI / 2;
      particles.push({
        id: generateId(), type: 'dot', x, y, progress: 0, maxProgress: 35,
        delay: random(0, 20), alpha: 0, size: random(2, 4), angle,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SignalParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'wave') {
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8 * 0.6;
    } else if (p.type === 'bar') {
      p.alpha = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1;
    } else {
      p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SignalParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'wave') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, -Math.PI * 0.7, -Math.PI * 0.3);
      ctx.stroke();
    } else if (p.type === 'bar') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.fillRect(p.x, p.y - p.size, 8, p.size);
    } else {
      const dist = 40 + p.progress * 2;
      const px = p.x + Math.cos(p.angle) * dist;
      const py = p.y + Math.sin(p.angle) * dist;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
