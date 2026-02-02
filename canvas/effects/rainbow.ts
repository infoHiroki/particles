/**
 * Rainbow エフェクト
 * 虹 + 弧 + 輝き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#0000ff', '#8800ff'];

interface RainbowParticle extends Particle {
  type: 'arc' | 'sparkle' | 'fade';
  size: number;
  arcStart: number;
  arcEnd: number;
  colorIndex: number;
  currentX: number;
  currentY: number;
  color: string;
}

export const rainbowEffect: Effect = {
  config: { name: 'rainbow', description: '虹 + 輝き', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RainbowParticle[] = [];

    // Rainbow arcs
    for (let i = 0; i < 7; i++) {
      particles.push({
        id: generateId(), type: 'arc', x, y: y + 40, progress: 0,
        maxProgress: 80, delay: i * 3, alpha: 0, size: 80 + i * 8,
        arcStart: Math.PI, arcEnd: Math.PI * 2, colorIndex: i,
        currentX: x, currentY: y + 40, color: DEFAULT_COLORS[i],
      });
    }

    // Sparkles
    const sparkleCount = Math.floor(20 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      const angle = Math.PI + random(0, Math.PI);
      const dist = random(60, 140);
      particles.push({
        id: generateId(), type: 'sparkle', x, y: y + 40, progress: 0,
        maxProgress: 40, delay: random(10, 50), alpha: 0, size: random(2, 4),
        arcStart: 0, arcEnd: 0, colorIndex: Math.floor(random(0, 7)),
        currentX: x + Math.cos(angle) * dist, currentY: y + 40 + Math.sin(angle) * dist,
        color: DEFAULT_COLORS[Math.floor(random(0, 7))],
      });
    }

    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RainbowParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'arc') {
      p.arcEnd = Math.PI + t * Math.PI;
      p.alpha = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1;
      p.alpha *= 0.7;
    } else {
      p.alpha = Math.abs(Math.sin(p.progress * 0.3)) * (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RainbowParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'arc') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, Math.PI, p.arcEnd);
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
