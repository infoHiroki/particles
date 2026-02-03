/**
 * Transcend エフェクト
 * トランセンド + 超越 + 昇華
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ffffcc', '#ffff99'];
interface TranscendParticle extends Particle { type: 'light'; size: number; vy: number; glow: number; hue: number; color: string; }
export const transcendEffect: Effect = {
  config: { name: 'transcend', description: 'トランセンド + 超越', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: TranscendParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'light', x: x + random(-30, 30), y, progress: 0, maxProgress: 60, delay: random(0, 15), alpha: 0, size: random(4, 10), vy: random(-2, -1), glow: random(0, Math.PI * 2), hue: random(40, 60), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TranscendParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.vy -= 0.03;
    p.glow += 0.1;
    p.size *= 0.99;
    p.alpha = Math.sin(t * Math.PI) * (0.6 + Math.sin(p.glow) * 0.2);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TranscendParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.5);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, `hsl(${p.hue}, 100%, 80%)`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
