/**
 * Camera エフェクト
 * カメラ + フラッシュ + 撮影
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ffff88', '#aaaaaa'];
interface CameraParticle extends Particle { type: 'flash' | 'shutter' | 'sparkle'; size: number; color: string; }
export const cameraEffect: Effect = {
  config: { name: 'camera', description: 'カメラ + フラッシュ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CameraParticle[] = [];
    particles.push({ id: generateId(), type: 'flash', x, y, progress: 0, maxProgress: 25, alpha: 0, size: 80, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'shutter', x, y, progress: 0, maxProgress: 40, delay: 5, alpha: 0, size: 30, color: DEFAULT_COLORS[2] });
    const sparkleCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-50, 50), y: y + random(-40, 40), progress: 0, maxProgress: 35, delay: random(3, 15), alpha: 0, size: random(2, 5), color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CameraParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'flash') {
      p.alpha = t < 0.2 ? 1 : (1 - t) / 0.8;
    } else if (p.type === 'shutter') {
      p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    } else {
      p.alpha = t < 0.1 ? t / 0.1 : (1 - t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CameraParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'flash') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color);
      g.addColorStop(0.3, p.color + 'aa');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'shutter') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(p.x - p.size, p.y - p.size * 0.7, p.size * 2, p.size * 1.4, 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
