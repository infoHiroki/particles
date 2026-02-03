/**
 * Ethereal エフェクト
 * エーテル + 霊妙 + 幽玄
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aaccff', '#ccddff', '#eeeeff'];
interface EtherealParticle extends Particle { type: 'wisp'; size: number; baseX: number; baseY: number; drift: number; color: string; }
export const etherealEffect: Effect = {
  config: { name: 'ethereal', description: 'エーテル + 霊妙', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: EtherealParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      const px = x + random(-40, 40);
      const py = y + random(-40, 40);
      particles.push({ id: generateId(), type: 'wisp', x: px, y: py, progress: 0, maxProgress: 80, delay: random(0, 20), alpha: 0, size: random(15, 30), baseX: px, baseY: py, drift: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as EtherealParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.drift += 0.02;
    p.x = p.baseX + Math.sin(p.drift) * 10;
    p.y = p.baseY + Math.cos(p.drift * 0.7) * 8 - t * 20;
    p.alpha = Math.sin(t * Math.PI) * 0.3;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as EtherealParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(0.5, `${p.color}88`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
