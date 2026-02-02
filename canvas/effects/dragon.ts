/**
 * Dragon エフェクト
 * ドラゴン + 炎 + 翼
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4400', '#ff6600', '#ff8800'];
interface DragonParticle extends Particle { type: 'head' | 'flame' | 'scale'; size: number; vx: number; vy: number; rotation: number; color: string; }
export const dragonEffect: Effect = {
  config: { name: 'dragon', description: 'ドラゴン + 炎', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DragonParticle[] = [];
    particles.push({ id: generateId(), type: 'head', x, y, progress: 0, maxProgress: 70, alpha: 0, size: 25, vx: 0, vy: -0.5, rotation: 0, color: '#882200' });
    const flameCount = Math.floor(12 * intensity);
    for (let i = 0; i < flameCount; i++) {
      particles.push({ id: generateId(), type: 'flame', x: x + random(-10, 10), y: y + random(10, 25), progress: 0, maxProgress: 40, delay: random(5, 25), alpha: 0, size: random(8, 15), vx: random(-1, 1), vy: random(1, 2.5), rotation: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const scaleCount = Math.floor(8 * intensity);
    for (let i = 0; i < scaleCount; i++) {
      particles.push({ id: generateId(), type: 'scale', x: x + random(-35, 35), y: y + random(-25, 25), progress: 0, maxProgress: 50, delay: random(10, 30), alpha: 0, size: random(4, 7), vx: random(-0.5, 0.5), vy: random(-0.5, 0.5), rotation: random(0, Math.PI * 2), color: '#993300' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DragonParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'head') {
      p.y += p.vy;
      p.rotation = Math.sin(p.progress * 0.1) * 0.1;
    } else if (p.type === 'flame') {
      p.x += p.vx;
      p.y += p.vy;
      p.size *= 0.97;
    } else {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += 0.05;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DragonParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.type === 'head') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p.size * 0.8, -p.size * 0.2);
      ctx.lineTo(p.size * 1.3, -p.size * 0.1);
      ctx.lineTo(p.size * 0.9, p.size * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-p.size * 0.5, -p.size * 0.6);
      ctx.lineTo(-p.size * 0.2, -p.size * 1.1);
      ctx.lineTo(0, -p.size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p.size * 0.1, -p.size * 0.6);
      ctx.lineTo(p.size * 0.4, -p.size * 1);
      ctx.lineTo(p.size * 0.5, -p.size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.ellipse(-p.size * 0.2, -p.size * 0.15, p.size * 0.15, p.size * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(-p.size * 0.2, -p.size * 0.15, p.size * 0.06, p.size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'flame') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.quadraticCurveTo(p.size * 0.5, -p.size * 0.3, p.size * 0.3, p.size * 0.5);
      ctx.quadraticCurveTo(0, p.size * 0.3, -p.size * 0.3, p.size * 0.5);
      ctx.quadraticCurveTo(-p.size * 0.5, -p.size * 0.3, 0, -p.size);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(p.size * 0.7, p.size * 0.5);
      ctx.lineTo(-p.size * 0.7, p.size * 0.5);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },
};
