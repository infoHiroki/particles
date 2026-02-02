/**
 * Robot エフェクト
 * ロボット + 機械 + AI
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88aacc', '#aaccee', '#44ff44'];
interface RobotParticle extends Particle { type: 'head' | 'eye' | 'antenna' | 'spark'; size: number; blinkPhase: number; color: string; }
export const robotEffect: Effect = {
  config: { name: 'robot', description: 'ロボット + AI', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RobotParticle[] = [];
    particles.push({ id: generateId(), type: 'head', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 25, blinkPhase: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'eye', x: x - 8, y: y - 3, progress: 0, maxProgress: 55, delay: 3, alpha: 0, size: 5, blinkPhase: random(0, Math.PI * 2), color: DEFAULT_COLORS[2] });
    particles.push({ id: generateId(), type: 'eye', x: x + 8, y: y - 3, progress: 0, maxProgress: 55, delay: 3, alpha: 0, size: 5, blinkPhase: random(0, Math.PI * 2), color: DEFAULT_COLORS[2] });
    particles.push({ id: generateId(), type: 'antenna', x, y: y - 25, progress: 0, maxProgress: 55, delay: 5, alpha: 0, size: 4, blinkPhase: 0, color: '#ff4444' });
    const sparkCount = Math.floor(5 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({ id: generateId(), type: 'spark', x: x + random(-20, 20), y: y + random(-25, 15), progress: 0, maxProgress: 35, delay: random(10, 35), alpha: 0, size: random(2, 4), blinkPhase: 0, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RobotParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.blinkPhase += 0.2;
    if (p.type === 'eye') {
      p.alpha = (t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1) * (0.5 + Math.abs(Math.sin(p.blinkPhase)) * 0.5);
    } else if (p.type === 'antenna') {
      p.alpha = (t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1) * (Math.sin(p.blinkPhase) > 0 ? 1 : 0.3);
    } else {
      p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RobotParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'head') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(p.x - p.size, p.y - p.size * 0.8, p.size * 2, p.size * 1.6, 5);
      ctx.fill();
      ctx.strokeStyle = DEFAULT_COLORS[1];
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#666688';
      ctx.fillRect(p.x - p.size * 0.4, p.y + p.size * 0.4, p.size * 0.8, p.size * 0.2);
    } else if (p.type === 'eye') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'antenna') {
      ctx.strokeStyle = '#888888';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + 10);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
