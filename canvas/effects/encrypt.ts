/**
 * Encrypt エフェクト
 * 暗号化 + エンコード + ロック
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#6699ff', '#88aaff'];
interface EncryptParticle extends Particle { type: 'hex'; size: number; char: string; scrambleCount: number; vy: number; color: string; }
const HEX = '0123456789ABCDEF';
export const encryptEffect: Effect = {
  config: { name: 'encrypt', description: '暗号化 + エンコード', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: EncryptParticle[] = [];
    const count = Math.floor(16 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'hex', x: x + random(-45, 45), y: y + random(-25, 25), progress: 0, maxProgress: 45, delay: random(0, 15), alpha: 0, size: random(10, 12), char: HEX[Math.floor(Math.random() * 16)], scrambleCount: 0, vy: random(0.3, 0.8), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as EncryptParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.scrambleCount++;
    if (p.scrambleCount % 5 === 0) {
      p.char = HEX[Math.floor(Math.random() * 16)];
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as EncryptParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.font = `${p.size}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(p.char, p.x, p.y);
    ctx.restore();
  },
};
