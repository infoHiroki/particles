/**
 * Hashtag エフェクト
 * ハッシュタグ + # + トレンド
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#ff4488', '#44ff88'];
interface HashtagParticle extends Particle { type: 'hash' | 'word'; size: number; vx: number; vy: number; text: string; color: string; }
export const hashtagEffect: Effect = {
  config: { name: 'hashtag', description: 'ハッシュタグ + #', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HashtagParticle[] = [];
    particles.push({ id: generateId(), type: 'hash', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 35, vx: 0, vy: -0.5, text: '#', color: DEFAULT_COLORS[0] });
    const words = ['trend', 'viral', 'hot', 'new'];
    const wordCount = Math.floor(3 * intensity);
    for (let i = 0; i < wordCount; i++) {
      particles.push({ id: generateId(), type: 'word', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 50, delay: 10 + i * 8, alpha: 0, size: random(10, 14), vx: random(-0.5, 0.5), vy: random(-0.5, -1), text: '#' + words[i % words.length], color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HashtagParticle;
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
    const p = particle as HashtagParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.font = `bold ${p.size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();
  },
};
