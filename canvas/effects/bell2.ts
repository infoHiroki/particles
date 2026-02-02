/**
 * Bell2 エフェクト
 * ベル + 通知 + 鳴る
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#ffdd44', '#ffffff'];
interface Bell2Particle extends Particle { type: 'bell' | 'wave' | 'note'; size: number; swing: number; vx: number; vy: number; color: string; }
export const bell2Effect: Effect = {
  config: { name: 'bell2', description: 'ベル + 通知', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Bell2Particle[] = [];
    particles.push({ id: generateId(), type: 'bell', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 25, swing: 0, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    const waveCount = Math.floor(3 * intensity);
    for (let i = 0; i < waveCount; i++) {
      particles.push({ id: generateId(), type: 'wave', x, y: y - 15, progress: 0, maxProgress: 40, delay: 10 + i * 10, alpha: 0, size: 10 + i * 8, swing: 0, vx: 0, vy: 0, color: DEFAULT_COLORS[1] });
    }
    const noteCount = Math.floor(3 * intensity);
    for (let i = 0; i < noteCount; i++) {
      particles.push({ id: generateId(), type: 'note', x: x + random(-15, 15), y: y - 20, progress: 0, maxProgress: 50, delay: 15 + i * 8, alpha: 0, size: 12, swing: 0, vx: random(-0.5, 0.5), vy: -1, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Bell2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'bell') {
      p.swing = Math.sin(p.progress * 0.5) * 0.2;
    } else if (p.type === 'note') {
      p.x += p.vx;
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI) * (p.type === 'wave' ? 0.5 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Bell2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'bell') {
      ctx.translate(p.x, p.y - p.size);
      ctx.rotate(p.swing);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-p.size * 0.8, p.size);
      ctx.quadraticCurveTo(-p.size * 0.8, 0, 0, 0);
      ctx.quadraticCurveTo(p.size * 0.8, 0, p.size * 0.8, p.size);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, p.size, p.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'wave') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.font = `${p.size}px serif`;
      ctx.fillText('♪', p.x, p.y);
    }
    ctx.restore();
  },
};
