/**
 * Ring エフェクト
 * リング + 回転 + 軌道
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa44', '#44aaff', '#aa44ff'];
interface RingParticle extends Particle { type: 'ring' | 'orb'; size: number; rotation: number; spin: number; tilt: number; orbAngle: number; color: string; }
export const ringEffect: Effect = {
  config: { name: 'ring', description: 'リング + 軌道', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RingParticle[] = [];
    for (let i = 0; i < 3; i++) {
      particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 25 + i * 10, rotation: 0, spin: 0.03 * (i % 2 === 0 ? 1 : -1), tilt: 0.3 + i * 0.2, orbAngle: 0, color: DEFAULT_COLORS[i] });
    }
    const orbCount = Math.floor(5 * intensity);
    for (let i = 0; i < orbCount; i++) {
      particles.push({ id: generateId(), type: 'orb', x, y, progress: 0, maxProgress: 55, delay: random(5, 20), alpha: 0, size: random(3, 6), rotation: 0, spin: 0, tilt: 0, orbAngle: random(0, Math.PI * 2), color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RingParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'ring') {
      p.rotation += p.spin;
    } else {
      p.orbAngle += 0.08;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RingParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    if (p.type === 'ring') {
      ctx.rotate(p.rotation);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * p.tilt, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const ox = Math.cos(p.orbAngle) * 30;
      const oy = Math.sin(p.orbAngle) * 15;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(ox, oy, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
