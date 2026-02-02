/**
 * Essence エフェクト
 * エッセンス + 精髄 + 本質
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff88ff', '#dd66dd', '#bb44bb'];
interface EssenceParticle extends Particle { type: 'droplet'; size: number; angle: number; dist: number; targetDist: number; color: string; }
export const essenceEffect: Effect = {
  config: { name: 'essence', description: 'エッセンス + 精髄', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: EssenceParticle[] = [];
    const count = Math.floor(12 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const startDist = random(50, 80);
      particles.push({ id: generateId(), type: 'droplet', x, y, progress: 0, maxProgress: 55, delay: i * 3, alpha: 0, size: random(4, 8), angle, dist: startDist, targetDist: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as EssenceParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const ease = t * t;
    p.dist = p.dist * (1 - ease);
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as EssenceParticle;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * p.dist;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
