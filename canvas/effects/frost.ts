/**
 * Frost エフェクト
 * 霜 + 結晶 + 拡散
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#aaeeff', '#88ddff', '#66ccff'];

interface FrostParticle extends Particle {
  type: 'crystal' | 'spread' | 'sparkle';
  size: number;
  currentX: number;
  currentY: number;
  angle: number;
  rotation: number;
  color: string;
}

export const frostEffect: Effect = {
  config: { name: 'frost', description: '霜 + 結晶', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FrostParticle[] = [];

    // Ice crystals
    const crystalCount = Math.floor(8 * intensity);
    for (let i = 0; i < crystalCount; i++) {
      const angle = (i / crystalCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'crystal', x, y, progress: 0,
        maxProgress: 50 + random(0, 20), delay: random(0, 15), alpha: 0,
        size: random(8, 16), currentX: x, currentY: y, angle,
        rotation: random(0, Math.PI), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Spreading frost
    const spreadCount = Math.floor(15 * intensity);
    for (let i = 0; i < spreadCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'spread', x, y, progress: 0,
        maxProgress: 45 + random(0, 15), delay: random(5, 25), alpha: 0,
        size: random(3, 8), currentX: x, currentY: y, angle,
        rotation: 0, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Sparkles
    const sparkleCount = Math.floor(12 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        id: generateId(), type: 'sparkle', x, y, progress: 0,
        maxProgress: 35, delay: random(0, 30), alpha: 0,
        size: random(2, 4), currentX: x + random(-50, 50), currentY: y + random(-50, 50),
        angle: 0, rotation: 0, color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FrostParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'crystal') {
      const dist = t * 40;
      p.currentX = p.x + Math.cos(p.angle) * dist;
      p.currentY = p.y + Math.sin(p.angle) * dist;
      p.rotation += 0.02;
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    } else if (p.type === 'spread') {
      const dist = t * 60;
      p.currentX = p.x + Math.cos(p.angle) * dist;
      p.currentY = p.y + Math.sin(p.angle) * dist;
      p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7 * 0.6;
    } else {
      p.alpha = Math.abs(Math.sin(p.progress * 0.4)) * (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FrostParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'crystal') {
      ctx.translate(p.currentX, p.currentY);
      ctx.rotate(p.rotation);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;

      // Six-pointed crystal
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * p.size, Math.sin(a) * p.size);
        ctx.stroke();
      }
    } else if (p.type === 'spread') {
      ctx.fillStyle = p.color + '80';
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
