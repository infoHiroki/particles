/**
 * Basketball エフェクト
 * バスケ + ボール + ダンク
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6600', '#444444', '#ffffff'];
interface BasketballParticle extends Particle { type: 'ball' | 'net' | 'sweat'; size: number; vx: number; vy: number; rotation: number; color: string; }
export const basketballEffect: Effect = {
  config: { name: 'basketball', description: 'バスケ + ダンク', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BasketballParticle[] = [];
    particles.push({ id: generateId(), type: 'ball', x, y, progress: 0, maxProgress: 50, alpha: 0, size: 18, vx: 0, vy: 2, rotation: 0, color: DEFAULT_COLORS[0] });
    for (let i = 0; i < 3; i++) {
      particles.push({ id: generateId(), type: 'net', x: x + (i - 1) * 8, y: y + 25, progress: 0, maxProgress: 45, delay: 10 + i * 3, alpha: 0, size: 15, vx: (i - 1) * 0.3, vy: 0.5, rotation: 0, color: DEFAULT_COLORS[2] });
    }
    const sweatCount = Math.floor(5 * intensity);
    for (let i = 0; i < sweatCount; i++) {
      particles.push({ id: generateId(), type: 'sweat', x: x + random(-25, 25), y: y + random(-10, 10), progress: 0, maxProgress: 40, delay: random(5, 20), alpha: 0, size: random(2, 4), vx: random(-0.5, 0.5), vy: random(0.5, 1.5), rotation: 0, color: '#88ccff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BasketballParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'ball') {
      p.vy += 0.15;
      p.rotation += 0.1;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.75 ? (1 - t) / 0.25 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BasketballParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.type === 'ball') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-p.size, 0);
      ctx.lineTo(p.size, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(0, p.size);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'net') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(p.size * 0.3, p.size * 0.5, 0, p.size);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
