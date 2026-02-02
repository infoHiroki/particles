/**
 * Runner エフェクト
 * ランニング + スピード + 風
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa44', '#ff8844', '#ffffff'];
interface RunnerParticle extends Particle { type: 'dust' | 'sweat' | 'line'; size: number; vx: number; vy: number; color: string; }
export const runnerEffect: Effect = {
  config: { name: 'runner', description: 'ランニング + スピード', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RunnerParticle[] = [];
    const dustCount = Math.floor(10 * intensity);
    for (let i = 0; i < dustCount; i++) {
      particles.push({ id: generateId(), type: 'dust', x: x + random(-10, 10), y: y + random(5, 15), progress: 0, maxProgress: 40, delay: random(0, 15), alpha: 0, size: random(4, 8), vx: -random(1, 2.5), vy: random(-0.5, 0.5), color: DEFAULT_COLORS[0] });
    }
    const lineCount = Math.floor(5 * intensity);
    for (let i = 0; i < lineCount; i++) {
      particles.push({ id: generateId(), type: 'line', x: x + random(-30, 0), y: y + random(-15, 15), progress: 0, maxProgress: 25, delay: random(0, 10), alpha: 0, size: random(15, 30), vx: -3, vy: 0, color: DEFAULT_COLORS[2] });
    }
    const sweatCount = Math.floor(4 * intensity);
    for (let i = 0; i < sweatCount; i++) {
      particles.push({ id: generateId(), type: 'sweat', x: x + random(-5, 15), y: y + random(-20, -5), progress: 0, maxProgress: 35, delay: random(5, 20), alpha: 0, size: random(2, 4), vx: -random(0.5, 1.5), vy: random(0.5, 1.5), color: '#88ddff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RunnerParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'dust') {
      p.size += 0.1;
      p.vx *= 0.97;
    } else if (p.type === 'sweat') {
      p.vy += 0.05;
    }
    p.alpha = t < 0.1 ? t / 0.1 : (1 - t) * (p.type === 'dust' ? 0.5 : 0.8);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RunnerParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'dust') {
      ctx.fillStyle = p.color + '88';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'line') {
      ctx.strokeStyle = p.color + 'aa';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.size, p.y);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
