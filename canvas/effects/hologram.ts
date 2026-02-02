/**
 * Hologram エフェクト
 * ホログラム + 揺らぎ + スキャンライン
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#44ffff', '#66ffff', '#88ffff'];

interface HologramParticle extends Particle {
  type: 'main' | 'scanline' | 'glitch' | 'particle';
  size: number;
  currentX: number;
  currentY: number;
  offset: number;
  color: string;
}

export const hologramEffect: Effect = {
  config: { name: 'hologram', description: 'ホログラム + 揺らぎ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HologramParticle[] = [];

    // Main hologram body
    particles.push({
      id: generateId(), type: 'main', x, y, progress: 0, maxProgress: 70,
      alpha: 0, size: 50, currentX: x, currentY: y, offset: 0, color: DEFAULT_COLORS[0],
    });

    // Scan lines
    for (let i = 0; i < 5; i++) {
      particles.push({
        id: generateId(), type: 'scanline', x, y: y - 40 + i * 20,
        progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 80,
        currentX: x, currentY: y - 40 + i * 20, offset: random(0, 100),
        color: DEFAULT_COLORS[1],
      });
    }

    // Glitch fragments
    const glitchCount = Math.floor(8 * intensity);
    for (let i = 0; i < glitchCount; i++) {
      particles.push({
        id: generateId(), type: 'glitch', x: x + random(-30, 30), y: y + random(-40, 40),
        progress: 0, maxProgress: 25, delay: random(10, 50), alpha: 0,
        size: random(10, 30), currentX: x + random(-30, 30), currentY: y + random(-40, 40),
        offset: random(-10, 10), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Floating particles
    const particleCount = Math.floor(15 * intensity);
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: generateId(), type: 'particle', x, y, progress: 0, maxProgress: 55,
        delay: random(0, 30), alpha: 0, size: random(1, 3),
        currentX: x + random(-40, 40), currentY: y + random(-50, 50),
        offset: random(0, Math.PI * 2), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HologramParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'main') {
      p.offset = Math.sin(p.progress * 0.1) * 3;
      p.alpha = (t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1) * 0.6;
    } else if (p.type === 'scanline') {
      p.alpha = Math.random() > 0.1 ? 0.3 : 0;
    } else if (p.type === 'glitch') {
      p.currentX = p.x + p.offset + random(-5, 5);
      p.alpha = 0.8;
    } else {
      p.currentY += Math.sin(p.progress * 0.1 + p.offset) * 0.5;
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8 * 0.7;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HologramParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'main') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.rect(p.x - p.size / 2 + p.offset, p.y - p.size, p.size, p.size * 2);
      ctx.stroke();
    } else if (p.type === 'scanline') {
      ctx.strokeStyle = p.color + '60';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size / 2, p.currentY);
      ctx.lineTo(p.x + p.size / 2, p.currentY);
      ctx.stroke();
    } else if (p.type === 'glitch') {
      ctx.fillStyle = p.color + '80';
      ctx.fillRect(p.currentX - p.size / 2, p.currentY - 3, p.size, 6);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
