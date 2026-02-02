/**
 * Starfield エフェクト
 * 星野 + 流れ + ワープ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#aaaaff', '#ffaaaa'];
interface StarfieldParticle extends Particle { type: 'star'; size: number; z: number; startX: number; startY: number; color: string; }
export const starfieldEffect: Effect = {
  config: { name: 'starfield', description: '星野 + 流れ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: StarfieldParticle[] = [];
    const count = Math.floor(50 * intensity);
    for (let i = 0; i < count; i++) {
      const startX = random(-100, 100);
      const startY = random(-100, 100);
      particles.push({ id: generateId(), type: 'star', x: x + startX, y: y + startY, progress: 0, maxProgress: 60, delay: random(0, 20), alpha: 0, size: random(1, 3), z: random(0.1, 1), startX: x + startX, startY: y + startY, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StarfieldParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const speed = 1 + t * 3;
    const cx = p.startX;
    const cy = p.startY;
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      p.x += (dx / dist) * speed * p.z;
      p.y += (dy / dist) * speed * p.z;
    }
    p.size = (1 + t * 2) * p.z;
    p.alpha = Math.min(1, t * 2) * (1 - t * 0.5);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StarfieldParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
