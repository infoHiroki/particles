/**
 * Question エフェクト
 * 疑問 + ハテナ + ?
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#aaddff'];
interface QuestionParticle extends Particle { type: 'mark' | 'float'; size: number; vy: number; color: string; }
export const questionEffect: Effect = {
  config: { name: 'question', description: '疑問 + ハテナ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: QuestionParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'mark', x: x + random(-15, 15), y: y + random(-10, 10), progress: 0, maxProgress: 60, delay: i * 10, alpha: 0, size: random(20, 30), vy: -0.5, color: DEFAULT_COLORS[i % 3] });
    }
    const floatCount = Math.floor(5 * intensity);
    for (let i = 0; i < floatCount; i++) {
      particles.push({ id: generateId(), type: 'float', x: x + random(-25, 25), y: y + random(-20, 20), progress: 0, maxProgress: 50, delay: random(5, 20), alpha: 0, size: random(3, 6), vy: random(-0.5, -1), color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as QuestionParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as QuestionParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'mark') {
      ctx.fillStyle = p.color;
      ctx.font = `bold ${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', p.x, p.y);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
