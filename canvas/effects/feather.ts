/**
 * Feather エフェクト
 * 羽 + 羽毛 + フェザー
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#eeeeee', '#dddddd'];
interface FeatherParticle extends Particle { type: 'feather'; size: number; rotation: number; rotSpeed: number; vx: number; vy: number; color: string; }
export const featherEffect: Effect = {
  config: { name: 'feather', description: '羽 + 羽毛', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FeatherParticle[] = [];
    const count = Math.floor(6 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'feather', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 70, delay: i * 6, alpha: 0, size: random(12, 18), rotation: random(0, Math.PI * 2), rotSpeed: random(-0.05, 0.05), vx: random(-0.5, 0.5), vy: random(0.3, 0.8), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FeatherParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx + Math.sin(p.progress * 0.08) * 0.8;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FeatherParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-p.size, 0);
    ctx.lineTo(p.size, 0);
    ctx.stroke();
    ctx.restore();
  },
};
