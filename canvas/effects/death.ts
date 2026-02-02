/**
 * Death エフェクト
 * 消滅 + 魂 + 散逸
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#666688', '#8888aa', '#aaaacc'];

interface DeathParticle extends Particle {
  type: 'soul' | 'fragment' | 'fade';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
}

export const deathEffect: Effect = {
  config: { name: 'death', description: '消滅 + 魂', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DeathParticle[] = [];

    // Soul rising
    particles.push({
      id: generateId(), type: 'soul', x, y, progress: 0, maxProgress: 60,
      alpha: 0, size: 20, currentX: x, currentY: y, vx: 0, vy: -1.5,
      rotation: 0, color: DEFAULT_COLORS[0],
    });

    // Fragments
    const fragCount = Math.floor(15 * intensity);
    for (let i = 0; i < fragCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(2, 5);
      particles.push({
        id: generateId(), type: 'fragment', x, y, progress: 0, maxProgress: 40,
        delay: random(0, 10), alpha: 0, size: random(4, 10),
        currentX: x + random(-20, 20), currentY: y + random(-20, 20),
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1,
        rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Fade particles
    const fadeCount = Math.floor(20 * intensity);
    for (let i = 0; i < fadeCount; i++) {
      particles.push({
        id: generateId(), type: 'fade', x, y, progress: 0, maxProgress: 50,
        delay: random(0, 15), alpha: 0, size: random(2, 5),
        currentX: x + random(-30, 30), currentY: y + random(-30, 30),
        vx: random(-0.5, 0.5), vy: -random(0.5, 1.5),
        rotation: 0, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DeathParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'soul') {
      p.currentY += p.vy;
      p.currentX += Math.sin(p.progress * 0.1) * 0.5;
      p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7 * 0.6;
    } else if (p.type === 'fragment') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vy += 0.1;
      p.rotation += 0.1;
      p.alpha = 1 - t;
      p.size *= 0.98;
    } else {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.alpha = (1 - t) * 0.7;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DeathParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'soul') {
      const g = ctx.createRadialGradient(p.currentX, p.currentY, 0, p.currentX, p.currentY, p.size);
      g.addColorStop(0, '#ffffff88');
      g.addColorStop(0.5, p.color + '66');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(p.currentX, p.currentY, p.size, p.size * 1.3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'fragment') {
      ctx.translate(p.currentX, p.currentY);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
