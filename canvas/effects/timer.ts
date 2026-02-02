/**
 * Timer エフェクト
 * タイマー + カウントダウン + 時間
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4444', '#ffaa44', '#44ff44'];
interface TimerParticle extends Particle { type: 'ring' | 'tick' | 'number'; size: number; angle: number; value: number; color: string; }
export const timerEffect: Effect = {
  config: { name: 'timer', description: 'タイマー + カウントダウン', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TimerParticle[] = [];
    particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 35, angle: -Math.PI / 2, value: 0, color: DEFAULT_COLORS[0] });
    const tickCount = 12;
    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * Math.PI * 2 - Math.PI / 2;
      particles.push({ id: generateId(), type: 'tick', x, y, progress: 0, maxProgress: 80, delay: i * 2, alpha: 0, size: 30, angle, value: 0, color: '#666666' });
    }
    for (let i = 3; i >= 1; i--) {
      particles.push({ id: generateId(), type: 'number', x, y, progress: 0, maxProgress: 20, delay: (3 - i) * 20, alpha: 0, size: 30, angle: 0, value: i, color: DEFAULT_COLORS[3 - i] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TimerParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'ring') {
      p.angle = -Math.PI / 2 + t * Math.PI * 2;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TimerParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, -Math.PI / 2, p.angle);
      ctx.stroke();
    } else if (p.type === 'tick') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      const inner = p.size - 5;
      const outer = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x + Math.cos(p.angle) * inner, p.y + Math.sin(p.angle) * inner);
      ctx.lineTo(p.x + Math.cos(p.angle) * outer, p.y + Math.sin(p.angle) * outer);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.font = `bold ${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(p.value), p.x, p.y);
    }
    ctx.restore();
  },
};
