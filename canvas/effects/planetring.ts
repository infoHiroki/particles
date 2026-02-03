/**
 * Planetring エフェクト
 * プラネットリング + 惑星環 + 土星
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#dda86a', '#c9a55c', '#b8944e'];
interface PlanetringParticle extends Particle { type: 'planet' | 'ring'; size: number; rotation: number; ringWidth: number; color: string; }
export const planetringEffect: Effect = {
  config: { name: 'planetring', description: 'プラネットリング + 惑星環', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PlanetringParticle[] = [];
    particles.push({ id: generateId(), type: 'planet', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 25, rotation: 0, ringWidth: 0, color: '#dda86a' });
    const ringCount = Math.floor(3 * intensity);
    for (let i = 0; i < ringCount; i++) {
      particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 70, delay: 5, alpha: 0, size: 35 + i * 8, rotation: -0.4, ringWidth: random(3, 6), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PlanetringParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.rotation += 0.005;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PlanetringParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    if (p.type === 'planet') {
      const gradient = ctx.createRadialGradient(-p.size * 0.3, -p.size * 0.3, 0, 0, 0, p.size);
      gradient.addColorStop(0, '#f5d89a');
      gradient.addColorStop(0.5, '#dda86a');
      gradient.addColorStop(1, '#a07840');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.rotate(p.rotation);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.ringWidth;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
