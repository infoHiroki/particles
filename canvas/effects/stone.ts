/**
 * Stone エフェクト
 * ストーン + 岩 + 砕け
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#696969', '#808080', '#a9a9a9'];
interface StoneParticle extends Particle { type: 'rock'; size: number; rotation: number; vx: number; vy: number; color: string; }
export const stoneEffect: Effect = {
  config: { name: 'stone', description: 'ストーン + 岩', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: StoneParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(2, 6);
      particles.push({ id: generateId(), type: 'rock', x, y, progress: 0, maxProgress: 40, delay: 0, alpha: 0, size: random(5, 12), rotation: random(0, Math.PI), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StoneParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2;
    p.vx *= 0.98;
    p.rotation += 0.05;
    p.alpha = 1 - t;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StoneParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(-p.size / 2, -p.size / 3);
    ctx.lineTo(p.size / 2, -p.size / 2);
    ctx.lineTo(p.size / 2, p.size / 3);
    ctx.lineTo(-p.size / 3, p.size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
