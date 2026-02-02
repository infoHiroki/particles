/**
 * Battery エフェクト
 * バッテリー + 充電 + エネルギー
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44ff44', '#88ff88', '#ffff44'];
interface BatteryParticle extends Particle { type: 'body' | 'charge' | 'spark'; size: number; chargeLevel: number; vx: number; vy: number; color: string; }
export const batteryEffect: Effect = {
  config: { name: 'battery', description: 'バッテリー + 充電', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BatteryParticle[] = [];
    particles.push({ id: generateId(), type: 'body', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 25, chargeLevel: 0, vx: 0, vy: 0, color: '#888888' });
    particles.push({ id: generateId(), type: 'charge', x, y, progress: 0, maxProgress: 55, delay: 5, alpha: 0, size: 20, chargeLevel: 0, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    const sparkCount = Math.floor(8 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({ id: generateId(), type: 'spark', x: x + random(-5, 5), y: y + random(-15, 15), progress: 0, maxProgress: 35, delay: random(10, 40), alpha: 0, size: random(2, 4), chargeLevel: 0, vx: random(-0.5, 0.5), vy: random(-1, -0.3), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BatteryParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'charge') {
      p.chargeLevel = Math.min(1, p.chargeLevel + 0.02);
    } else if (p.type === 'spark') {
      p.x += p.vx;
      p.y += p.vy;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BatteryParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'body') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(p.x - p.size, p.y - p.size * 0.6, p.size * 2, p.size * 1.2, 3);
      ctx.stroke();
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + p.size, p.y - p.size * 0.2, p.size * 0.2, p.size * 0.4);
    } else if (p.type === 'charge') {
      ctx.fillStyle = p.color;
      const width = p.size * 1.8 * p.chargeLevel;
      ctx.fillRect(p.x - p.size * 0.9, p.y - p.size * 0.45, width, p.size * 0.9);
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x - 5, p.y - 8);
      ctx.lineTo(p.x + 3, p.y);
      ctx.lineTo(p.x - 3, p.y);
      ctx.lineTo(p.x + 5, p.y + 8);
      ctx.stroke();
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
