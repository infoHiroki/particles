/**
 * Ski エフェクト
 * スキー + 雪 + スピード
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ddddff', '#aaccff'];
interface SkiParticle extends Particle { type: 'snow' | 'trail' | 'spray'; size: number; vx: number; vy: number; rotation: number; color: string; }
export const skiEffect: Effect = {
  config: { name: 'ski', description: 'スキー + 雪', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SkiParticle[] = [];
    const snowCount = Math.floor(15 * intensity);
    for (let i = 0; i < snowCount; i++) {
      particles.push({ id: generateId(), type: 'snow', x: x + random(-20, 20), y: y + random(-5, 10), progress: 0, maxProgress: 45, delay: random(0, 15), alpha: 0, size: random(3, 7), vx: random(-2, -0.5), vy: random(-1.5, 0.5), rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    for (let i = 0; i < 2; i++) {
      particles.push({ id: generateId(), type: 'trail', x: x + (i - 0.5) * 15, y: y + 8, progress: 0, maxProgress: 55, delay: 0, alpha: 0, size: 40, vx: -2.5, vy: 0.5, rotation: 0.2, color: DEFAULT_COLORS[0] });
    }
    const sprayCount = Math.floor(8 * intensity);
    for (let i = 0; i < sprayCount; i++) {
      const angle = random(-Math.PI * 0.7, -Math.PI * 0.3);
      const speed = random(1.5, 3);
      particles.push({ id: generateId(), type: 'spray', x, y, progress: 0, maxProgress: 35, delay: random(0, 8), alpha: 0, size: random(2, 4), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, rotation: 0, color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SkiParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'snow') {
      p.rotation += 0.05;
    } else if (p.type === 'spray') {
      p.vy += 0.05;
    }
    p.alpha = t < 0.1 ? t / 0.1 : (1 - t) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SkiParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'snow') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * p.size, Math.sin(a) * p.size);
      }
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (p.type === 'trail') {
      ctx.strokeStyle = p.color + '66';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.size, p.y + p.size * Math.tan(p.rotation));
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
