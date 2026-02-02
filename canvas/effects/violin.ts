/**
 * Violin エフェクト
 * バイオリン + 弦 + 優雅
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aa6633', '#cc8844', '#ffdd88'];
interface ViolinParticle extends Particle { type: 'bow' | 'string' | 'note'; size: number; phase: number; vx: number; vy: number; color: string; }
export const violinEffect: Effect = {
  config: { name: 'violin', description: 'バイオリン + 弦', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ViolinParticle[] = [];
    particles.push({ id: generateId(), type: 'bow', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 40, phase: 0, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    for (let i = 0; i < 4; i++) {
      particles.push({ id: generateId(), type: 'string', x, y: y - 10 + i * 7, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 30, phase: random(0, Math.PI), vx: 0, vy: 0, color: DEFAULT_COLORS[2] });
    }
    const noteCount = Math.floor(5 * intensity);
    for (let i = 0; i < noteCount; i++) {
      particles.push({ id: generateId(), type: 'note', x, y: y - 20, progress: 0, maxProgress: 60, delay: 15 + i * 10, alpha: 0, size: 10, phase: 0, vx: random(-0.5, 0.5), vy: -1.2, color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ViolinParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.15;
    if (p.type === 'note') {
      p.x += p.vx + Math.sin(p.phase) * 0.3;
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ViolinParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'bow') {
      const bowX = p.x + Math.sin(p.phase) * 15;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bowX - p.size / 2, p.y - 15);
      ctx.lineTo(bowX + p.size / 2, p.y + 15);
      ctx.stroke();
    } else if (p.type === 'string') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const amp = Math.sin(p.phase) * 3;
      ctx.moveTo(p.x - p.size / 2, p.y);
      ctx.quadraticCurveTo(p.x, p.y + amp, p.x + p.size / 2, p.y);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.font = `${p.size * 2}px serif`;
      ctx.fillText('♫', p.x, p.y);
    }
    ctx.restore();
  },
};
