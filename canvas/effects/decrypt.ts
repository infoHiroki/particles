/**
 * Decrypt エフェクト
 * 復号化 + デコード + アンロック
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44ff88', '#66ffaa', '#88ffcc'];
interface DecryptParticle extends Particle { type: 'char'; size: number; finalChar: string; currentChar: string; revealed: boolean; vy: number; color: string; }
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const decryptEffect: Effect = {
  config: { name: 'decrypt', description: '復号化 + デコード', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DecryptParticle[] = [];
    const count = Math.floor(12 * intensity);
    for (let i = 0; i < count; i++) {
      const finalChar = CHARS[Math.floor(Math.random() * CHARS.length)];
      particles.push({ id: generateId(), type: 'char', x: x + random(-40, 40), y: y + random(-20, 20), progress: 0, maxProgress: 50, delay: i * 3, alpha: 0, size: random(10, 14), finalChar, currentChar: CHARS[Math.floor(Math.random() * CHARS.length)], revealed: false, vy: random(-0.3, 0.3), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DecryptParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    if (t > 0.6 && !p.revealed) {
      p.revealed = true;
      p.currentChar = p.finalChar;
      p.color = '#ffffff';
    } else if (!p.revealed) {
      p.currentChar = CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DecryptParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.font = `${p.size}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(p.currentChar, p.x, p.y);
    ctx.restore();
  },
};
