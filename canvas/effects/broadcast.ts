/**
 * Broadcast エフェクト
 * 放送 + 拡散 + 波
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff8844', '#ffaa66', '#ffcc88'];

interface BroadcastParticle extends Particle {
  type: 'tower' | 'wave' | 'signal';
  size: number;
  angle: number;
  speed: number;
  color: string;
}

export const broadcastEffect: Effect = {
  config: { name: 'broadcast', description: '放送 + 拡散', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BroadcastParticle[] = [];

    // Tower
    particles.push({
      id: generateId(), type: 'tower', x, y, progress: 0, maxProgress: 60,
      alpha: 0, size: 30, angle: 0, speed: 0, color: DEFAULT_COLORS[0],
    });

    // Expanding waves
    for (let i = 0; i < 5; i++) {
      particles.push({
        id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 45,
        delay: i * 8, alpha: 0, size: 20, angle: 0, speed: 3, color: DEFAULT_COLORS[1],
      });
    }

    // Signal particles
    const signalCount = Math.floor(12 * intensity);
    for (let i = 0; i < signalCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'signal', x, y, progress: 0, maxProgress: 40,
        delay: random(5, 25), alpha: 0, size: random(2, 4), angle,
        speed: random(3, 6), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BroadcastParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'tower') {
      p.alpha = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
    } else if (p.type === 'wave') {
      p.size += p.speed;
      p.alpha = (1 - t) * 0.5;
    } else {
      p.size *= 0.98;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BroadcastParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'tower') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      // Tower shape
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.lineTo(p.x + 5, p.y - p.size + 10);
      ctx.lineTo(p.x + 10, p.y + p.size * 0.5);
      ctx.lineTo(p.x - 10, p.y + p.size * 0.5);
      ctx.lineTo(p.x - 5, p.y - p.size + 10);
      ctx.closePath();
      ctx.fill();
      // Antenna
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.lineTo(p.x, p.y - p.size - 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y - p.size - 15, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'wave') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y - p.size, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const dist = p.progress * p.speed;
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
