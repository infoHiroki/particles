/**
 * Zodiac エフェクト
 * ゾディアック + 黄道帯 + 星座記号
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffd700', '#c0c0c0', '#cd7f32'];
const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
interface ZodiacParticle extends Particle { type: 'symbol'; size: number; symbol: string; rotation: number; glow: number; color: string; }
export const zodiacEffect: Effect = {
  config: { name: 'zodiac', description: 'ゾディアック + 黄道帯', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ZodiacParticle[] = [];
    const count = Math.floor(6 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = random(40, 60);
      particles.push({ id: generateId(), type: 'symbol', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 60, delay: i * 4, alpha: 0, size: random(16, 24), symbol: ZODIAC_SYMBOLS[Math.floor(random(0, 12))], rotation: random(-0.2, 0.2), glow: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ZodiacParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.glow = Math.sin(t * Math.PI * 3) * 0.5 + 0.5;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ZodiacParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha * p.glow;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.font = `${p.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = p.color;
    ctx.fillText(p.symbol, 0, 0);
    ctx.restore();
  },
};
