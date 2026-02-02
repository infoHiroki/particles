/**
 * Powerup エフェクト
 * パワーアップ + 上昇オーラ + 輝き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffdd00', '#ffaa00', '#ff8800'];

interface PowerupParticle extends Particle {
  type: 'aura' | 'rising' | 'sparkle';
  size: number;
  currentX: number;
  currentY: number;
  vy: number;
  vx: number;
  pulsePhase: number;
  color: string;
}

export const powerupEffect: Effect = {
  config: { name: 'powerup', description: 'パワーアップ + オーラ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PowerupParticle[] = [];

    // Central aura
    particles.push({
      id: generateId(), type: 'aura', x, y, progress: 0, maxProgress: 60,
      alpha: 0, size: 50, currentX: x, currentY: y, vy: 0, vx: 0, pulsePhase: 0,
      color: DEFAULT_COLORS[0],
    });

    // Rising particles
    const risingCount = Math.floor(15 * intensity);
    for (let i = 0; i < risingCount; i++) {
      particles.push({
        id: generateId(), type: 'rising', x, y, progress: 0, maxProgress: 50,
        delay: random(0, 20), alpha: 0, size: random(3, 6),
        currentX: x + random(-30, 30), currentY: y + random(-20, 20),
        vy: -random(2, 4), vx: random(-0.5, 0.5), pulsePhase: 0,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Sparkles
    const sparkleCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        id: generateId(), type: 'sparkle', x, y, progress: 0, maxProgress: 30,
        delay: random(0, 30), alpha: 0, size: random(2, 4),
        currentX: x + random(-40, 40), currentY: y + random(-40, 40),
        vy: 0, vx: 0, pulsePhase: random(0, Math.PI * 2),
        color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PowerupParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'aura') {
      p.pulsePhase += 0.1;
      p.size = 50 + Math.sin(p.pulsePhase) * 10;
      p.alpha = (t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1) * 0.6;
    } else if (p.type === 'rising') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    } else {
      p.pulsePhase += 0.3;
      p.alpha = Math.abs(Math.sin(p.pulsePhase)) * (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PowerupParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'aura') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + 'aa');
      g.addColorStop(0.5, p.color + '44');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'rising') {
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
