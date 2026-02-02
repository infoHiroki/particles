/**
 * Wifi エフェクト
 * Wi-Fi + 電波 + 接続
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aaff', '#66bbff', '#88ccff'];
interface WifiParticle extends Particle { type: 'wave' | 'dot'; size: number; angle: number; color: string; }
export const wifiEffect: Effect = {
  config: { name: 'wifi', description: 'Wi-Fi + 電波', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: WifiParticle[] = [];
    particles.push({ id: generateId(), type: 'dot', x, y: y + 15, progress: 0, maxProgress: 55, alpha: 0, size: 6, angle: 0, color: DEFAULT_COLORS[0] });
    for (let i = 0; i < 3; i++) {
      particles.push({ id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 50, delay: i * 8, alpha: 0, size: 15 + i * 15, angle: 0, color: DEFAULT_COLORS[i] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WifiParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WifiParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'dot') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, -Math.PI * 0.75, -Math.PI * 0.25);
      ctx.stroke();
    }
    ctx.restore();
  },
};
