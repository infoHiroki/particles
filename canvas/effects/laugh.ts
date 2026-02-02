/**
 * Laugh エフェクト
 * 笑い + 喜び + ハハハ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffdd44', '#ffee66', '#ffcc22'];
interface LaughParticle extends Particle { type: 'ha' | 'tear'; size: number; vx: number; vy: number; text: string; color: string; }
export const laughEffect: Effect = {
  config: { name: 'laugh', description: '笑い + 喜び', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: LaughParticle[] = [];
    const count = Math.floor(5 * intensity);
    const texts = ['ハ', 'は', 'w', '笑'];
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'ha', x: x + random(-20, 20), y: y + random(-10, 10), progress: 0, maxProgress: 50, delay: i * 6, alpha: 0, size: random(12, 18), vx: random(-0.5, 0.5), vy: random(-1, -2), text: texts[i % texts.length], color: DEFAULT_COLORS[i % 3] });
    }
    const tearCount = Math.floor(3 * intensity);
    for (let i = 0; i < tearCount; i++) {
      particles.push({ id: generateId(), type: 'tear', x: x + (i % 2 === 0 ? -15 : 15), y, progress: 0, maxProgress: 40, delay: 10 + i * 8, alpha: 0, size: 4, vx: 0, vy: 1.5, text: '', color: '#88ccff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LaughParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LaughParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'ha') {
      ctx.font = `bold ${p.size}px sans-serif`;
      ctx.fillStyle = p.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.text, p.x, p.y);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
