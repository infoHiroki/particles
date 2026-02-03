/**
 * Leather エフェクト
 * レザー + 革 + 質感
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#8b4513', '#654321', '#3d2314'];
interface LeatherParticle extends Particle { type: 'strip'; width: number; length: number; curl: number; rotation: number; color: string; }
export const leatherEffect: Effect = {
  config: { name: 'leather', description: 'レザー + 革', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: LeatherParticle[] = [];
    const count = Math.floor(10 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(20, 50);
      particles.push({ id: generateId(), type: 'strip', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 45, delay: random(0, 8), alpha: 0, width: random(4, 8), length: random(15, 25), curl: random(0, Math.PI), rotation: angle, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LeatherParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.curl += 0.08;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LeatherParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(p.length * 0.5, Math.sin(p.curl) * 10, p.length, Math.sin(p.curl * 2) * 5);
    ctx.stroke();
    ctx.restore();
  },
};
