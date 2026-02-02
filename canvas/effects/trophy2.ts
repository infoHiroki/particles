/**
 * Trophy2 エフェクト
 * トロフィー + 優勝 + 栄光
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#ffdd44', '#ffffff'];
interface Trophy2Particle extends Particle { type: 'cup' | 'sparkle' | 'confetti'; size: number; vx: number; vy: number; gravity: number; color: string; }
export const trophy2Effect: Effect = {
  config: { name: 'trophy2', description: 'トロフィー + 優勝', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Trophy2Particle[] = [];
    particles.push({ id: generateId(), type: 'cup', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 35, vx: 0, vy: 0, gravity: 0, color: DEFAULT_COLORS[0] });
    const sparkleCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-30, 30), y: y + random(-40, 20), progress: 0, maxProgress: 40, delay: random(10, 30), alpha: 0, size: random(3, 6), vx: 0, vy: 0, gravity: 0, color: DEFAULT_COLORS[2] });
    }
    const confettiCount = Math.floor(12 * intensity);
    for (let i = 0; i < confettiCount; i++) {
      particles.push({ id: generateId(), type: 'confetti', x, y: y - 40, progress: 0, maxProgress: 60, delay: 15 + i * 2, alpha: 0, size: random(4, 8), vx: random(-2, 2), vy: random(-3, -1), gravity: 0.1, color: `hsl(${random(0, 360)}, 80%, 60%)` });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Trophy2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'confetti') {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Trophy2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'cup') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size * 0.6, p.y - p.size * 0.5);
      ctx.quadraticCurveTo(p.x - p.size * 0.7, p.y + p.size * 0.3, p.x - p.size * 0.2, p.y + p.size * 0.3);
      ctx.lineTo(p.x + p.size * 0.2, p.y + p.size * 0.3);
      ctx.quadraticCurveTo(p.x + p.size * 0.7, p.y + p.size * 0.3, p.x + p.size * 0.6, p.y - p.size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(p.x - 5, p.y + p.size * 0.3, 10, 15);
      ctx.fillRect(p.x - 12, p.y + p.size * 0.3 + 15, 24, 8);
      ctx.beginPath();
      ctx.arc(p.x - p.size * 0.6, p.y, 8, Math.PI * 0.5, Math.PI * 1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x + p.size * 0.6, p.y, 8, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.stroke();
    } else if (p.type === 'sparkle') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.restore();
  },
};
