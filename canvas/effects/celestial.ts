/**
 * Celestial エフェクト
 * セレスティアル + 天体 + 神聖
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffd700', '#ffffff', '#87ceeb'];
interface CelestialParticle extends Particle { type: 'halo' | 'ray'; size: number; angle: number; pulse: number; color: string; }
export const celestialEffect: Effect = {
  config: { name: 'celestial', description: 'セレスティアル + 天体', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CelestialParticle[] = [];
    const haloCount = Math.floor(3 * intensity);
    for (let i = 0; i < haloCount; i++) {
      particles.push({ id: generateId(), type: 'halo', x, y, progress: 0, maxProgress: 70, delay: i * 5, alpha: 0, size: 20 + i * 15, angle: 0, pulse: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const rayCount = Math.floor(8 * intensity);
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'ray', x, y, progress: 0, maxProgress: 60, delay: 10, alpha: 0, size: random(40, 70), angle, pulse: random(0, Math.PI * 2), color: '#ffd700' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CelestialParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.pulse += 0.1;
    if (p.type === 'halo') {
      p.alpha = Math.sin(t * Math.PI) * 0.5;
    } else {
      p.size = 40 + Math.sin(p.pulse) * 20;
      p.alpha = Math.sin(t * Math.PI) * 0.6;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CelestialParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'halo') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const gradient = ctx.createLinearGradient(p.x, p.y, p.x + Math.cos(p.angle) * p.size, p.y + Math.sin(p.angle) * p.size);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'transparent');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.size, p.y + Math.sin(p.angle) * p.size);
      ctx.stroke();
    }
    ctx.restore();
  },
};
