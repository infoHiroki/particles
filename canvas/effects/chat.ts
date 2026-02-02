/**
 * Chat エフェクト
 * チャット + メッセージ + 会話
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#66aaff', '#44cc88', '#ffffff'];
interface ChatParticle extends Particle { type: 'bubble'; size: number; side: number; vy: number; color: string; }
export const chatEffect: Effect = {
  config: { name: 'chat', description: 'チャット + メッセージ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ChatParticle[] = [];
    const count = Math.floor(4 * intensity);
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      particles.push({ id: generateId(), type: 'bubble', x: x + side * 20, y: y + 20 - i * 15, progress: 0, maxProgress: 60, delay: i * 8, alpha: 0, size: random(25, 35), side, vy: -0.5, color: i % 2 === 0 ? DEFAULT_COLORS[0] : DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ChatParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ChatParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.roundRect(p.x - p.size / 2, p.y - 10, p.size, 20, 8);
    ctx.fill();
    ctx.beginPath();
    if (p.side < 0) {
      ctx.moveTo(p.x - p.size / 2 + 5, p.y + 10);
      ctx.lineTo(p.x - p.size / 2 - 5, p.y + 15);
      ctx.lineTo(p.x - p.size / 2 + 10, p.y + 10);
    } else {
      ctx.moveTo(p.x + p.size / 2 - 5, p.y + 10);
      ctx.lineTo(p.x + p.size / 2 + 5, p.y + 15);
      ctx.lineTo(p.x + p.size / 2 - 10, p.y + 10);
    }
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(p.x - 8 + i * 8, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
