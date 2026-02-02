/**
 * Joy エフェクト
 * 喜び + 輝き + 躍動
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffdd44', '#ffcc00', '#ffaa00'];

interface JoyParticle extends Particle {
  type: 'star' | 'sparkle' | 'bounce';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
}

export const joyEffect: Effect = {
  config: { name: 'joy', description: '喜び + 輝き', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: JoyParticle[] = [];

    // Bursting stars
    const starCount = Math.floor(8 * intensity);
    for (let i = 0; i < starCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(3, 8);
      particles.push({
        id: generateId(), type: 'star', x, y, progress: 0, maxProgress: 40,
        delay: random(0, 10), alpha: 0, size: random(8, 15),
        currentX: x, currentY: y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Sparkles
    const sparkleCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        id: generateId(), type: 'sparkle', x, y, progress: 0, maxProgress: 35,
        delay: random(0, 25), alpha: 0, size: random(2, 5),
        currentX: x + random(-60, 60), currentY: y + random(-60, 60),
        vx: 0, vy: 0, rotation: random(0, Math.PI * 2), color: '#ffffff',
      });
    }

    // Bouncing particles
    const bounceCount = Math.floor(10 * intensity);
    for (let i = 0; i < bounceCount; i++) {
      particles.push({
        id: generateId(), type: 'bounce', x, y, progress: 0, maxProgress: 50,
        delay: random(5, 20), alpha: 0, size: random(4, 8),
        currentX: x + random(-40, 40), currentY: y,
        vx: random(-2, 2), vy: -random(5, 10), rotation: 0,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as JoyParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'star') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.rotation += 0.1;
      p.alpha = 1 - t;
    } else if (p.type === 'sparkle') {
      p.alpha = Math.abs(Math.sin(p.progress * 0.4)) * (1 - t);
    } else {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vy += 0.3;
      p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as JoyParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'star') {
      ctx.translate(p.currentX, p.currentY);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;

      // 4-point star
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? p.size : p.size * 0.4;
        const a = (i / 8) * Math.PI * 2;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'sparkle') {
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
