/**
 * Transform エフェクト
 * 変身 + 光 + オーラ拡散
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffdd44', '#ffcc00', '#ffaa00'];

interface TransformParticle extends Particle {
  type: 'flash' | 'aura' | 'burst' | 'sparkle';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  color: string;
}

export const transformEffect: Effect = {
  config: { name: 'transform', description: '変身 + 光', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TransformParticle[] = [];

    // Initial flash
    particles.push({
      id: generateId(), type: 'flash', x, y, progress: 0, maxProgress: 20,
      alpha: 0, size: 80, currentX: x, currentY: y, vx: 0, vy: 0,
      color: '#ffffff',
    });

    // Aura expansion
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(), type: 'aura', x, y, progress: 0, maxProgress: 50,
        delay: 5 + i * 8, alpha: 0, size: 30, currentX: x, currentY: y, vx: 0, vy: 0,
        color: DEFAULT_COLORS[i],
      });
    }

    // Burst particles
    const burstCount = Math.floor(20 * intensity);
    for (let i = 0; i < burstCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(4, 10);
      particles.push({
        id: generateId(), type: 'burst', x, y, progress: 0, maxProgress: 35,
        delay: 8, alpha: 0, size: random(3, 6), currentX: x, currentY: y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Sparkles
    const sparkleCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        id: generateId(), type: 'sparkle', x, y, progress: 0, maxProgress: 40,
        delay: random(5, 25), alpha: 0, size: random(2, 4),
        currentX: x + random(-60, 60), currentY: y + random(-60, 60),
        vx: 0, vy: 0, color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TransformParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'flash') {
      p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7;
      p.size = 80 + t * 40;
    } else if (p.type === 'aura') {
      p.size = 30 + t * 80;
      p.alpha = (1 - t) * 0.5;
    } else if (p.type === 'burst') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.alpha = 1 - t;
    } else {
      p.alpha = Math.abs(Math.sin(p.progress * 0.4)) * (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TransformParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'flash') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color);
      g.addColorStop(0.3, p.color + 'cc');
      g.addColorStop(0.6, p.color + '44');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'aura') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'burst') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(p.currentX, p.currentY - s);
      ctx.lineTo(p.currentX + s * 0.3, p.currentY);
      ctx.lineTo(p.currentX, p.currentY + s);
      ctx.lineTo(p.currentX - s * 0.3, p.currentY);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },
};
