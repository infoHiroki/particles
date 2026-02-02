/**
 * Code エフェクト
 * コード + プログラム + 文字列
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ff88', '#00cc66', '#009944'];
const CHARS = '{}[]()<>;:=+-*/&|!?#@$%^~';
interface CodeParticle extends Particle { type: 'char'; size: number; char: string; vy: number; color: string; }
export const codeEffect: Effect = {
  config: { name: 'code', description: 'コード + プログラム', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CodeParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'char', x: x + random(-40, 40), y: y + random(-20, 20), progress: 0, maxProgress: 50, delay: random(0, 15), alpha: 0, size: random(10, 14), char: CHARS[Math.floor(Math.random() * CHARS.length)], vy: random(0.5, 1), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CodeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CodeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.font = `${p.size}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(p.char, p.x, p.y);
    ctx.restore();
  },
};
