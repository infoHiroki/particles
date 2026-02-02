/**
 * Pierce エフェクト
 * ピアス + 貫通 + 突き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff8844', '#ffaa66', '#ffcc88'];
interface PierceParticle extends Particle { type: 'point' | 'trail'; size: number; vx: number; vy: number; color: string; }
export const pierceEffect: Effect = {
  config: { name: 'pierce', description: 'ピアス + 貫通', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PierceParticle[] = [];
    particles.push({ id: generateId(), type: 'point', x: x - 40, y, progress: 0, maxProgress: 20, delay: 0, alpha: 0, size: 8, vx: 8, vy: 0, color: DEFAULT_COLORS[0] });
    const trailCount = Math.floor(10 * intensity);
    for (let i = 0; i < trailCount; i++) {
      particles.push({ id: generateId(), type: 'trail', x: x - 40 - i * 5, y: y + random(-5, 5), progress: 0, maxProgress: 25, delay: i * 2, alpha: 0, size: random(2, 4), vx: 6, vy: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PierceParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.alpha = p.type === 'point' ? 1 : (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PierceParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'point') {
      ctx.beginPath();
      ctx.moveTo(p.x + p.size, p.y);
      ctx.lineTo(p.x - p.size / 2, p.y - p.size / 2);
      ctx.lineTo(p.x - p.size / 2, p.y + p.size / 2);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
