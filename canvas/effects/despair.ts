/**
 * Despair エフェクト
 * ディスペア + 絶望 + 暗闇
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#1a1a2e', '#16213e', '#0f3460'];
interface DespairParticle extends Particle { type: 'void'; size: number; shrinkRate: number; color: string; }
export const despairEffect: Effect = {
  config: { name: 'despair', description: 'ディスペア + 絶望', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DespairParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(30, 70);
      particles.push({ id: generateId(), type: 'void', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 60, delay: random(0, 15), alpha: 0, size: random(30, 50), shrinkRate: random(0.3, 0.6), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DespairParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.size -= p.shrinkRate;
    if (p.size < 5) p.size = 5;
    p.alpha = Math.sin(t * Math.PI) * 0.7;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DespairParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.5, p.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
