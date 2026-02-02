/**
 * Fireflies エフェクト
 * 蛍 + 明滅 + 漂い (群)
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#88ff88', '#aaff88', '#ccff88'];

interface FirefliesParticle extends Particle {
  type: 'firefly';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  phase: number;
  blinkSpeed: number;
  color: string;
}

export const firefliesEffect: Effect = {
  config: { name: 'fireflies', description: '蛍群 + 明滅', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FirefliesParticle[] = [];

    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const startX = x + random(-100, 100);
      const startY = y + random(-80, 80);
      particles.push({
        id: generateId(), type: 'firefly', x, y, progress: 0,
        maxProgress: 150 + random(0, 50), delay: random(0, 30), alpha: 0,
        size: random(3, 5), currentX: startX, currentY: startY,
        vx: 0, vy: 0, targetX: startX + random(-50, 50), targetY: startY + random(-50, 50),
        phase: random(0, Math.PI * 2), blinkSpeed: random(0.08, 0.15),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FirefliesParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    // Move towards target
    const dx = p.targetX - p.currentX;
    const dy = p.targetY - p.currentY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 5) {
      // Pick new target
      p.targetX = p.x + random(-100, 100);
      p.targetY = p.y + random(-80, 80);
    } else {
      p.vx += (dx / dist) * 0.05;
      p.vy += (dy / dist) * 0.05;
    }

    p.vx *= 0.98;
    p.vy *= 0.98;
    p.currentX += p.vx;
    p.currentY += p.vy;

    // Blinking
    p.phase += p.blinkSpeed;
    const blink = Math.max(0, Math.sin(p.phase));
    p.alpha = blink * (t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1);

    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FirefliesParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    // Glow
    const g = ctx.createRadialGradient(p.currentX, p.currentY, 0, p.currentX, p.currentY, p.size * 4);
    g.addColorStop(0, p.color);
    g.addColorStop(0.3, p.color + '80');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.currentX, p.currentY, p.size * 4, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(p.currentX, p.currentY, p.size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },
};
