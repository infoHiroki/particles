/**
 * Engine エフェクト
 * エンジン + 動力 + 振動
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#555555', '#777777', '#ff6600'];
interface EngineParticle extends Particle { type: 'body' | 'exhaust' | 'spark'; size: number; vx: number; vy: number; shake: number; color: string; }
export const engineEffect: Effect = {
  config: { name: 'engine', description: 'エンジン + 動力', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: EngineParticle[] = [];
    particles.push({ id: generateId(), type: 'body', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 25, vx: 0, vy: 0, shake: 0, color: DEFAULT_COLORS[0] });
    const exhaustCount = Math.floor(15 * intensity);
    for (let i = 0; i < exhaustCount; i++) {
      particles.push({ id: generateId(), type: 'exhaust', x: x + 30, y, progress: 0, maxProgress: 40, delay: i * 3, alpha: 0, size: random(3, 6), vx: random(2, 4), vy: random(-1, 1), shake: 0, color: '#444444' });
    }
    const sparkCount = Math.floor(8 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({ id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 20, delay: random(0, 40), alpha: 0, size: random(2, 4), vx: random(-2, 2), vy: random(-2, 2), shake: 0, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as EngineParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'body') {
      p.shake = Math.sin(p.progress * 0.5) * 2;
      p.alpha = Math.sin(t * Math.PI);
    } else if (p.type === 'exhaust') {
      p.x += p.vx;
      p.y += p.vy;
      p.size += 0.1;
      p.alpha = (1 - t) * 0.5;
    } else {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as EngineParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'body') {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size + p.shake, p.y - p.size * 0.6, p.size * 2, p.size * 1.2);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
