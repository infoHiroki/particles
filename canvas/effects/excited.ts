/**
 * Excited エフェクト
 * 興奮 + 躍動 + エネルギー
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff6644', '#ff8844', '#ffaa44'];

interface ExcitedParticle extends Particle {
  type: 'burst' | 'spin' | 'spark';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  angle: number;
  color: string;
}

export const excitedEffect: Effect = {
  config: { name: 'excited', description: '興奮 + 躍動', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ExcitedParticle[] = [];

    // Spinning lines
    const spinCount = 8;
    for (let i = 0; i < spinCount; i++) {
      const angle = (i / spinCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'spin', x, y, progress: 0, maxProgress: 45,
        delay: 0, alpha: 0, size: 30, currentX: x, currentY: y, vx: 0, vy: 0,
        angle, color: DEFAULT_COLORS[i % 3],
      });
    }

    // Bursting particles
    const burstCount = Math.floor(20 * intensity);
    for (let i = 0; i < burstCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(5, 12);
      particles.push({
        id: generateId(), type: 'burst', x, y, progress: 0, maxProgress: 35,
        delay: random(5, 15), alpha: 0, size: random(3, 7),
        currentX: x, currentY: y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        angle: 0, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Sparks
    const sparkCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({
        id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 30,
        delay: random(0, 20), alpha: 0, size: random(2, 4),
        currentX: x + random(-50, 50), currentY: y + random(-50, 50),
        vx: 0, vy: 0, angle: random(0, Math.PI * 2), color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ExcitedParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'spin') {
      p.angle += 0.15;
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    } else if (p.type === 'burst') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.alpha = 1 - t;
    } else {
      p.alpha = Math.random() > 0.3 ? (1 - t) : 0;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ExcitedParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'spin') {
      const startX = p.x + Math.cos(p.angle) * 15;
      const startY = p.y + Math.sin(p.angle) * 15;
      const endX = p.x + Math.cos(p.angle) * p.size;
      const endY = p.y + Math.sin(p.angle) * p.size;

      const g = ctx.createLinearGradient(startX, startY, endX, endY);
      g.addColorStop(0, p.color);
      g.addColorStop(1, 'transparent');
      ctx.strokeStyle = g;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
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
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
