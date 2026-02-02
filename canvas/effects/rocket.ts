/**
 * Rocket エフェクト
 * ロケット + 発射 + 宇宙
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6600', '#ffaa00', '#ffdd00'];
interface RocketParticle extends Particle { type: 'rocket' | 'flame' | 'smoke'; size: number; vy: number; vx: number; color: string; }
export const rocketEffect: Effect = {
  config: { name: 'rocket', description: 'ロケット + 発射', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RocketParticle[] = [];
    particles.push({ id: generateId(), type: 'rocket', x, y, progress: 0, maxProgress: 65, alpha: 0, size: 20, vy: -2, vx: 0, color: '#dddddd' });
    const flameCount = Math.floor(15 * intensity);
    for (let i = 0; i < flameCount; i++) {
      particles.push({ id: generateId(), type: 'flame', x: x + random(-8, 8), y: y + 20, progress: 0, maxProgress: 35, delay: random(0, 30), alpha: 0, size: random(6, 12), vy: random(1, 3), vx: random(-0.5, 0.5), color: DEFAULT_COLORS[i % 3] });
    }
    const smokeCount = Math.floor(8 * intensity);
    for (let i = 0; i < smokeCount; i++) {
      particles.push({ id: generateId(), type: 'smoke', x: x + random(-15, 15), y: y + random(25, 40), progress: 0, maxProgress: 50, delay: random(5, 25), alpha: 0, size: random(10, 20), vy: random(0.2, 0.8), vx: random(-0.5, 0.5), color: '#888888' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RocketParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'rocket') {
      p.y += p.vy;
      p.vy -= 0.05;
    } else if (p.type === 'flame') {
      p.y += p.vy;
      p.x += p.vx;
      p.size *= 0.95;
    } else {
      p.y += p.vy;
      p.x += p.vx;
      p.size += 0.3;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.75 ? (1 - t) / 0.25 : (p.type === 'smoke' ? 0.4 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RocketParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'rocket') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.lineTo(p.x + p.size * 0.4, p.y + p.size * 0.3);
      ctx.lineTo(p.x + p.size * 0.4, p.y + p.size * 0.8);
      ctx.lineTo(p.x - p.size * 0.4, p.y + p.size * 0.8);
      ctx.lineTo(p.x - p.size * 0.4, p.y + p.size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size * 0.5);
      ctx.lineTo(p.x + p.size * 0.3, p.y);
      ctx.lineTo(p.x - p.size * 0.3, p.y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#aaaaaa';
      ctx.beginPath();
      ctx.moveTo(p.x - p.size * 0.4, p.y + p.size * 0.5);
      ctx.lineTo(p.x - p.size * 0.7, p.y + p.size);
      ctx.lineTo(p.x - p.size * 0.4, p.y + p.size * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p.x + p.size * 0.4, p.y + p.size * 0.5);
      ctx.lineTo(p.x + p.size * 0.7, p.y + p.size);
      ctx.lineTo(p.x + p.size * 0.4, p.y + p.size * 0.8);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'flame') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.quadraticCurveTo(p.x + p.size * 0.5, p.y, p.x, p.y + p.size * 0.5);
      ctx.quadraticCurveTo(p.x - p.size * 0.5, p.y, p.x, p.y - p.size);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color + '66';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
