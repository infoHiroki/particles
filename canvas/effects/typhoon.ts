/**
 * Typhoon エフェクト
 * 台風 + 暴風雨 + 渦巻き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#667788', '#556677', '#445566'];
interface TyphoonParticle extends Particle { type: 'debris'; size: number; angle: number; dist: number; rotSpeed: number; color: string; }
export const typhoonEffect: Effect = {
  config: { name: 'typhoon', description: '台風 + 暴風雨', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TyphoonParticle[] = [];
    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({ id: generateId(), type: 'debris', x, y, progress: 0, maxProgress: 70, delay: random(0, 10), alpha: 0, size: random(3, 7), angle, dist: random(10, 50), rotSpeed: random(0.1, 0.2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TyphoonParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.rotSpeed;
    p.dist += 0.5;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TyphoonParticle;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * p.dist;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.translate(px, py);
    ctx.rotate(p.angle * 2);
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  },
};
