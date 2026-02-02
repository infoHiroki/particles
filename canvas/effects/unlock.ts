/**
 * Unlock エフェクト
 * 解錠 + 開放 + 光
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffdd44', '#ffcc00', '#ffaa00'];

interface UnlockParticle extends Particle {
  type: 'lock' | 'burst' | 'sparkle';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
}

export const unlockEffect: Effect = {
  config: { name: 'unlock', description: '解錠 + 開放', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: UnlockParticle[] = [];

    // Lock opening animation
    particles.push({
      id: generateId(), type: 'lock', x, y, progress: 0, maxProgress: 30,
      alpha: 0, size: 25, currentX: x, currentY: y, vx: 0, vy: 0, rotation: 0,
      color: DEFAULT_COLORS[0],
    });

    // Burst particles
    const burstCount = Math.floor(15 * intensity);
    for (let i = 0; i < burstCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(4, 10);
      particles.push({
        id: generateId(), type: 'burst', x, y, progress: 0, maxProgress: 30,
        delay: 10, alpha: 0, size: random(3, 6), currentX: x, currentY: y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, rotation: 0,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Sparkles
    const sparkleCount = Math.floor(12 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        id: generateId(), type: 'sparkle', x, y, progress: 0, maxProgress: 40,
        delay: random(5, 25), alpha: 0, size: random(2, 4),
        currentX: x + random(-50, 50), currentY: y + random(-50, 50),
        vx: 0, vy: 0, rotation: random(0, Math.PI * 2), color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as UnlockParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'lock') {
      p.rotation = t * Math.PI * 0.3;
      p.alpha = t < 0.3 ? 1 : (1 - t) / 0.7;
    } else if (p.type === 'burst') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.alpha = 1 - t;
    } else {
      p.alpha = Math.abs(Math.sin(p.progress * 0.3)) * (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as UnlockParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'lock') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;

      // Lock body
      ctx.beginPath();
      ctx.roundRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.8, 3);
      ctx.stroke();

      // Lock shackle (opening)
      ctx.beginPath();
      ctx.arc(0, -p.size / 4, p.size * 0.35, Math.PI, 0);
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
      // Star shape
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(p.currentX, p.currentY - s);
      ctx.lineTo(p.currentX + s * 0.3, p.currentY - s * 0.3);
      ctx.lineTo(p.currentX + s, p.currentY);
      ctx.lineTo(p.currentX + s * 0.3, p.currentY + s * 0.3);
      ctx.lineTo(p.currentX, p.currentY + s);
      ctx.lineTo(p.currentX - s * 0.3, p.currentY + s * 0.3);
      ctx.lineTo(p.currentX - s, p.currentY);
      ctx.lineTo(p.currentX - s * 0.3, p.currentY - s * 0.3);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },
};
