/**
 * Slot エフェクト
 * スロット + リール + 回転
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#ff0000', '#00cc00'];
interface SlotParticle extends Particle { type: 'reel' | 'frame' | 'symbol'; size: number; phase: number; speed: number; symbol: string; color: string; }
export const slotEffect: Effect = {
  config: { name: 'slot', description: 'スロット + リール', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: SlotParticle[] = [];
    const symbols = ['7', '🍒', '🔔', '⭐', '💎'];
    for (let i = 0; i < 3; i++) {
      particles.push({ id: generateId(), type: 'frame', x: x - 35 + i * 35, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 30, phase: 0, speed: 0, symbol: '', color: '#333333' });
      particles.push({ id: generateId(), type: 'reel', x: x - 35 + i * 35, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 25, phase: random(0, Math.PI * 2), speed: 0.3 - i * 0.05, symbol: symbols[Math.floor(random(0, 5))], color: DEFAULT_COLORS[i] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SlotParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'reel') {
      p.phase += p.speed * (1 - t * 0.8);
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SlotParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'frame') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    } else {
      ctx.fillStyle = p.color;
      ctx.font = `bold ${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const offset = Math.sin(p.phase) * 10;
      ctx.fillText(p.symbol, p.x, p.y + offset);
    }
    ctx.restore();
  },
};
