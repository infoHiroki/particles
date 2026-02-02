/**
 * Pulsar エフェクト
 * パルサー + 回転 + ビーム
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ffff', '#ffffff', '#ff00ff'];
interface PulsarParticle extends Particle { type: 'core' | 'beam' | 'pulse'; size: number; angle: number; length: number; color: string; }
export const pulsarEffect: Effect = {
  config: { name: 'pulsar', description: 'パルサー + 回転', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PulsarParticle[] = [];
    particles.push({ id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 10, angle: 0, length: 0, color: '#ffffff' });
    particles.push({ id: generateId(), type: 'beam', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 4, angle: 0, length: 60, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'beam', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 4, angle: Math.PI, length: 60, color: DEFAULT_COLORS[0] });
    const pulseCount = Math.floor(5 * intensity);
    for (let i = 0; i < pulseCount; i++) {
      particles.push({ id: generateId(), type: 'pulse', x, y, progress: 0, maxProgress: 40, delay: i * 15, alpha: 0, size: 10, angle: 0, length: 0, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PulsarParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'beam') {
      p.angle += 0.08;
    } else if (p.type === 'pulse') {
      p.size = 10 + t * 40;
    }
    p.alpha = p.type === 'pulse' ? (1 - t) * 0.5 : Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PulsarParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'core') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'beam') {
      const ex = p.x + Math.cos(p.angle) * p.length;
      const ey = p.y + Math.sin(p.angle) * p.length;
      const grad = ctx.createLinearGradient(p.x, p.y, ex, ey);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
