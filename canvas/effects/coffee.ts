/**
 * Coffee エフェクト
 * コーヒー + 湯気 + 香り
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#885533', '#664422', '#553311'];
interface CoffeeParticle extends Particle { type: 'cup' | 'steam' | 'aroma'; size: number; vx: number; vy: number; wavePhase: number; color: string; }
export const coffeeEffect: Effect = {
  config: { name: 'coffee', description: 'コーヒー + 湯気', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CoffeeParticle[] = [];
    particles.push({ id: generateId(), type: 'cup', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 25, vx: 0, vy: 0, wavePhase: 0, color: '#ffffff' });
    const steamCount = Math.floor(8 * intensity);
    for (let i = 0; i < steamCount; i++) {
      particles.push({ id: generateId(), type: 'steam', x: x + random(-10, 10), y: y - 20, progress: 0, maxProgress: 50, delay: random(0, 25), alpha: 0, size: random(8, 15), vx: random(-0.2, 0.2), vy: -random(0.5, 1), wavePhase: random(0, Math.PI * 2), color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CoffeeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'steam') {
      p.y += p.vy;
      p.wavePhase += 0.1;
      p.x += Math.sin(p.wavePhase) * 0.3;
      p.size += 0.1;
    }
    p.alpha = t < 0.1 ? t / 0.1 : (1 - t) * (p.type === 'steam' ? 0.4 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CoffeeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'cup') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size, p.y - p.size * 0.6);
      ctx.lineTo(p.x - p.size * 0.8, p.y + p.size * 0.6);
      ctx.lineTo(p.x + p.size * 0.8, p.y + p.size * 0.6);
      ctx.lineTo(p.x + p.size, p.y - p.size * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#885533';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y - p.size * 0.5, p.size * 0.85, p.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#dddddd';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x + p.size * 1.1, p.y, p.size * 0.4, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
