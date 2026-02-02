/**
 * Shutter エフェクト
 * シャッター + 閉じる + カメラ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#333333', '#444444', '#ffffff'];
interface ShutterParticle extends Particle { type: 'blade' | 'flash'; size: number; angle: number; closeAmount: number; color: string; }
export const shutterEffect: Effect = {
  config: { name: 'shutter', description: 'シャッター + 閉じる', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ShutterParticle[] = [];
    const bladeCount = 8;
    for (let i = 0; i < bladeCount; i++) {
      const angle = (i / bladeCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'blade', x, y, progress: 0, maxProgress: 40, delay: 0, alpha: 0, size: 45, angle, closeAmount: 0, color: DEFAULT_COLORS[i % 2] });
    }
    particles.push({ id: generateId(), type: 'flash', x, y, progress: 0, maxProgress: 20, delay: 40, alpha: 0, size: 60, angle: 0, closeAmount: 0, color: DEFAULT_COLORS[2] });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ShutterParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'blade') {
      p.closeAmount = t < 0.5 ? t * 2 : 2 - t * 2;
    }
    p.alpha = p.type === 'flash' ? (1 - t) : Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ShutterParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'blade') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle + p.closeAmount * 0.3);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(p.size * (1 - p.closeAmount * 0.5), -10);
      ctx.lineTo(p.size * (1 - p.closeAmount * 0.5), 10);
      ctx.closePath();
      ctx.fill();
    } else {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
