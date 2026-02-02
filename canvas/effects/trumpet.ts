/**
 * Trumpet エフェクト
 * トランペット + 金管 + 音波
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#ffdd44', '#ffaa00'];
interface TrumpetParticle extends Particle { type: 'bell' | 'wave' | 'note'; size: number; vx: number; vy: number; color: string; }
export const trumpetEffect: Effect = {
  config: { name: 'trumpet', description: 'トランペット + 金管', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TrumpetParticle[] = [];
    particles.push({ id: generateId(), type: 'bell', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 20, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    const waveCount = Math.floor(6 * intensity);
    for (let i = 0; i < waveCount; i++) {
      particles.push({ id: generateId(), type: 'wave', x: x + 15, y, progress: 0, maxProgress: 40, delay: i * 6, alpha: 0, size: 10 + i * 5, vx: 2, vy: 0, color: DEFAULT_COLORS[1] });
    }
    const noteCount = Math.floor(4 * intensity);
    for (let i = 0; i < noteCount; i++) {
      particles.push({ id: generateId(), type: 'note', x: x + 20, y: y + random(-15, 15), progress: 0, maxProgress: 50, delay: 10 + i * 10, alpha: 0, size: 8, vx: 1.5, vy: random(-0.5, 0.5), color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TrumpetParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type !== 'bell') {
      p.x += p.vx;
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI) * (p.type === 'bell' ? 1 : 0.7);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TrumpetParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'bell') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'wave') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, -0.5, 0.5);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.font = `${p.size * 2}px serif`;
      ctx.fillText('♪', p.x, p.y);
    }
    ctx.restore();
  },
};
