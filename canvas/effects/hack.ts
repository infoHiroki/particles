/**
 * Hack エフェクト
 * ハッキング + コード + 侵入
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff0044', '#ff2266', '#ff4488'];

interface HackParticle extends Particle {
  type: 'code' | 'breach' | 'warning';
  size: number;
  currentX: number;
  currentY: number;
  text: string;
  color: string;
}

export const hackEffect: Effect = {
  config: { name: 'hack', description: 'ハッキング + コード', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HackParticle[] = [];
    const chars = '0123456789ABCDEF!@#$%^&*';

    // Warning symbol
    particles.push({
      id: generateId(), type: 'warning', x, y, progress: 0, maxProgress: 50,
      alpha: 0, size: 40, currentX: x, currentY: y, text: '!', color: DEFAULT_COLORS[0],
    });

    // Breach circle
    particles.push({
      id: generateId(), type: 'breach', x, y, progress: 0, maxProgress: 40,
      delay: 5, alpha: 0, size: 30, currentX: x, currentY: y, text: '', color: DEFAULT_COLORS[1],
    });

    // Code particles
    const codeCount = Math.floor(25 * intensity);
    for (let i = 0; i < codeCount; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(30, 80);
      particles.push({
        id: generateId(), type: 'code', x, y, progress: 0, maxProgress: 45,
        delay: random(0, 20), alpha: 0, size: random(10, 14),
        currentX: x + Math.cos(angle) * dist, currentY: y + Math.sin(angle) * dist,
        text: chars[Math.floor(random(0, chars.length))], color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HackParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'warning') {
      p.alpha = Math.sin(p.progress * 0.5) > 0 ? 1 : 0.3;
    } else if (p.type === 'breach') {
      p.size = 30 + t * 30;
      p.alpha = (1 - t) * 0.6;
    } else {
      if (Math.random() > 0.7) {
        const chars = '0123456789ABCDEF!@#$%^&*';
        p.text = chars[Math.floor(random(0, chars.length))];
      }
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HackParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'warning') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.font = `bold ${p.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.text, p.x, p.y);
    } else if (p.type === 'breach') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.font = `${p.size}px monospace`;
      ctx.fillText(p.text, p.currentX, p.currentY);
    }
    ctx.restore();
  },
};
