/**
 * Ceramic エフェクト
 * セラミック + 陶器 + 割れ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#f5f5dc', '#fffaf0', '#faebd7'];
interface CeramicParticle extends Particle { type: 'shard'; size: number; rotation: number; vx: number; vy: number; color: string; }
export const ceramicEffect: Effect = {
  config: { name: 'ceramic', description: 'セラミック + 陶器', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CeramicParticle[] = [];
    const count = Math.floor(18 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(2, 5);
      particles.push({ id: generateId(), type: 'shard', x, y, progress: 0, maxProgress: 40, delay: 0, alpha: 0, size: random(5, 12), rotation: random(0, Math.PI * 2), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CeramicParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.18;
    p.rotation += 0.08;
    p.alpha = 1 - t;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CeramicParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -p.size / 2);
    ctx.lineTo(p.size / 2, 0);
    ctx.lineTo(p.size / 4, p.size / 2);
    ctx.lineTo(-p.size / 3, p.size / 3);
    ctx.lineTo(-p.size / 2, -p.size / 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
  },
};
