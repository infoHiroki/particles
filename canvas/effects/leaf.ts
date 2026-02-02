/**
 * Leaf エフェクト
 * 葉 + 木の葉 + リーフ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aa44', '#55bb55', '#66cc66'];
interface LeafParticle extends Particle { type: 'leaf'; size: number; rotation: number; rotSpeed: number; vx: number; vy: number; color: string; }
export const leafEffect: Effect = {
  config: { name: 'leaf', description: '葉 + 木の葉', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: LeafParticle[] = [];
    const count = Math.floor(10 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'leaf', x: x + random(-40, 40), y: y + random(-30, 30), progress: 0, maxProgress: 60, delay: i * 4, alpha: 0, size: random(8, 14), rotation: random(0, Math.PI * 2), rotSpeed: random(-0.1, 0.1), vx: random(-1, 1), vy: random(0.5, 1.5), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LeafParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx + Math.sin(p.progress * 0.1) * 0.5;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LeafParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#338833';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-p.size * 0.8, 0);
    ctx.lineTo(p.size * 0.8, 0);
    ctx.stroke();
    ctx.restore();
  },
};
