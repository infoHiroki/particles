/**
 * Coil エフェクト
 * コイル + 螺旋 + 巻き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff8844', '#ffaa66', '#ffcc88'];
interface CoilParticle extends Particle { type: 'segment'; size: number; coilIndex: number; baseAngle: number; radius: number; height: number; color: string; }
export const coilEffect: Effect = {
  config: { name: 'coil', description: 'コイル + 螺旋', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CoilParticle[] = [];
    const count = Math.floor(30 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'segment', x, y, progress: 0, maxProgress: 60, delay: i, alpha: 0, size: random(3, 5), coilIndex: i, baseAngle: 0, radius: 20, height: i * 2, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CoilParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.baseAngle += 0.08;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CoilParticle;
    const angle = p.baseAngle + p.coilIndex * 0.3;
    const px = p.x + Math.cos(angle) * p.radius;
    const py = p.y - p.height + Math.sin(angle) * p.radius * 0.3;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
