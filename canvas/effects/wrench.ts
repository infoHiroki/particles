/**
 * Wrench エフェクト
 * レンチ + 工具 + 修理
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#888888', '#666666', '#ffcc00'];
interface WrenchParticle extends Particle { type: 'tool' | 'spark'; size: number; rotation: number; rotSpeed: number; vx: number; vy: number; color: string; }
export const wrenchEffect: Effect = {
  config: { name: 'wrench', description: 'レンチ + 工具', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: WrenchParticle[] = [];
    particles.push({ id: generateId(), type: 'tool', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 30, rotation: -0.3, rotSpeed: 0.1, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    const sparkCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({ id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 30, delay: random(10, 40), alpha: 0, size: random(2, 4), rotation: 0, rotSpeed: 0, vx: random(-3, 3), vy: random(-3, 3), color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WrenchParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'tool') {
      p.rotation = -0.3 + Math.sin(p.progress * 0.3) * 0.4;
      p.alpha = Math.sin(t * Math.PI);
    } else {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WrenchParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'tool') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size * 0.1, -p.size * 0.5, p.size * 0.2, p.size);
      ctx.beginPath();
      ctx.arc(0, -p.size * 0.4, p.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, p.size * 0.4, p.size * 0.15, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
