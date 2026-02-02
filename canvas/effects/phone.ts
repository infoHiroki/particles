/**
 * Phone エフェクト
 * スマホ + 通知 + バイブ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aaff', '#ff4444', '#44ff44'];
interface PhoneParticle extends Particle { type: 'phone' | 'notification' | 'wave'; size: number; shakeOffset: number; color: string; }
export const phoneEffect: Effect = {
  config: { name: 'phone', description: 'スマホ + 通知', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PhoneParticle[] = [];
    particles.push({ id: generateId(), type: 'phone', x, y, progress: 0, maxProgress: 55, alpha: 0, size: 25, shakeOffset: 0, color: '#333333' });
    particles.push({ id: generateId(), type: 'notification', x: x + 12, y: y - 15, progress: 0, maxProgress: 50, delay: 5, alpha: 0, size: 8, shakeOffset: 0, color: DEFAULT_COLORS[1] });
    const waveCount = Math.floor(4 * intensity);
    for (let i = 0; i < waveCount; i++) {
      particles.push({ id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 40, delay: i * 8, alpha: 0, size: 30 + i * 12, shakeOffset: 0, color: DEFAULT_COLORS[0] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PhoneParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'phone') {
      p.shakeOffset = Math.sin(p.progress * 0.8) * 3;
    } else if (p.type === 'wave') {
      p.size += 1;
    }
    p.alpha = t < 0.1 ? t / 0.1 : (1 - t) * (p.type === 'wave' ? 0.5 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PhoneParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'phone') {
      ctx.translate(p.x + p.shakeOffset, p.y);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-p.size * 0.5, -p.size, p.size, p.size * 2, 4);
      ctx.fill();
      ctx.fillStyle = '#555555';
      ctx.fillRect(-p.size * 0.4, -p.size * 0.85, p.size * 0.8, p.size * 1.5);
    } else if (p.type === 'notification') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${p.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', p.x, p.y);
    } else {
      ctx.strokeStyle = p.color + '88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
