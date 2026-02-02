/**
 * Bike エフェクト
 * 自転車 + スピード + 風
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#888888', '#aaaaaa', '#ffffff'];
interface BikeParticle extends Particle { type: 'wheel' | 'spoke' | 'wind'; size: number; vx: number; rotation: number; spin: number; color: string; }
export const bikeEffect: Effect = {
  config: { name: 'bike', description: '自転車 + スピード', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BikeParticle[] = [];
    particles.push({ id: generateId(), type: 'wheel', x: x - 20, y, progress: 0, maxProgress: 50, alpha: 0, size: 18, vx: 3, rotation: 0, spin: 0.3, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'wheel', x: x + 20, y, progress: 0, maxProgress: 50, delay: 2, alpha: 0, size: 18, vx: 3, rotation: 0, spin: 0.3, color: DEFAULT_COLORS[0] });
    const windCount = Math.floor(8 * intensity);
    for (let i = 0; i < windCount; i++) {
      particles.push({ id: generateId(), type: 'wind', x: x + random(-40, 0), y: y + random(-20, 10), progress: 0, maxProgress: 30, delay: random(0, 15), alpha: 0, size: random(15, 30), vx: -random(2, 4), rotation: 0, spin: 0, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BikeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.rotation += p.spin;
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.75 ? (1 - t) / 0.25 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BikeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    if (p.type === 'wheel') {
      ctx.rotate(p.rotation);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * p.size, Math.sin(a) * p.size);
        ctx.stroke();
      }
    } else {
      ctx.strokeStyle = p.color + '88';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(p.size, 0);
      ctx.stroke();
    }
    ctx.restore();
  },
};
