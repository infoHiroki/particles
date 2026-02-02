/**
 * Speech エフェクト
 * 吹き出し + 会話 + セリフ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#eeeeee', '#dddddd'];
interface SpeechParticle extends Particle { type: 'bubble' | 'dot'; size: number; dotIndex: number; color: string; }
export const speechEffect: Effect = {
  config: { name: 'speech', description: '吹き出し + 会話', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SpeechParticle[] = [];
    particles.push({ id: generateId(), type: 'bubble', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 40, dotIndex: 0, color: DEFAULT_COLORS[0] });
    const dotCount = Math.floor(3 * intensity);
    for (let i = 0; i < dotCount; i++) {
      particles.push({ id: generateId(), type: 'dot', x: x - 10 + i * 10, y, progress: 0, maxProgress: 60, delay: 10 + i * 8, alpha: 0, size: 4, dotIndex: i, color: '#666666' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SpeechParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SpeechParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'bubble') {
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(p.x - 10, p.y + p.size * 0.5);
      ctx.lineTo(p.x - 20, p.y + p.size * 0.8);
      ctx.lineTo(p.x, p.y + p.size * 0.5);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
