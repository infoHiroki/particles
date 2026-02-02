/**
 * Impact エフェクト
 * 衝撃 + 振動 + 波紋
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ffffff', '#ffff88', '#ffaa44'];

interface ImpactParticle extends Particle {
  type: 'ring' | 'line' | 'flash';
  radius: number; maxRadius: number; angle: number; length: number;
  currentLength: number; color: string;
}

export const impactEffect: Effect = {
  config: { name: 'impact', description: '衝撃 + 振動', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ImpactParticle[] = [];
    // Flash
    particles.push({
      id: generateId(), type: 'flash', x, y, progress: 0, maxProgress: 10, alpha: 0,
      radius: 30, maxRadius: 60, angle: 0, length: 0, currentLength: 0, color: '#ffffff',
    });
    // Rings
    for (let i = 0; i < 2; i++) {
      particles.push({
        id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 25 + i * 10,
        delay: i * 5, alpha: 0, radius: 10, maxRadius: 70 + i * 20, angle: 0,
        length: 0, currentLength: 0, color: DEFAULT_COLORS[i],
      });
    }
    // Lines
    const lineCount = Math.floor(8 * intensity);
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'line', x, y, progress: 0, maxProgress: 20, alpha: 0,
        radius: 0, maxRadius: 0, angle, length: random(40, 80), currentLength: 0,
        color: DEFAULT_COLORS[2],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ImpactParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'flash') {
      p.radius = p.maxRadius * easeOutCubic(t);
      p.alpha = 1 - easeOutCubic(t);
    } else if (p.type === 'ring') {
      p.radius = 10 + (p.maxRadius - 10) * easeOutCubic(t);
      p.alpha = 1 - easeOutCubic(t);
    } else {
      p.currentLength = p.length * (t < 0.4 ? easeOutCubic(t / 0.4) : 1);
      p.alpha = t < 0.4 ? 1 : 1 - (t - 0.4) / 0.6;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ImpactParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    if (p.type === 'flash') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      g.addColorStop(0, '#ffffff'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
    } else if (p.type === 'ring') {
      ctx.strokeStyle = p.color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.strokeStyle = p.color; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.currentLength, p.y + Math.sin(p.angle) * p.currentLength);
      ctx.stroke();
    }
    ctx.restore();
  },
};
