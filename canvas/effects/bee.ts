/**
 * Bee エフェクト
 * 蜂 + 飛行 + ブンブン
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffdd00', '#333333', '#ffffff'];
interface BeeParticle extends Particle { type: 'bee' | 'wing'; size: number; angle: number; speed: number; centerX: number; centerY: number; color: string; }
export const beeEffect: Effect = {
  config: { name: 'bee', description: '蜂 + 飛行', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BeeParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'bee', x, y, progress: 0, maxProgress: 70, delay: i * 8, alpha: 0, size: random(8, 12), angle: random(0, Math.PI * 2), speed: random(0.05, 0.1), centerX: x, centerY: y, color: DEFAULT_COLORS[0] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BeeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.speed;
    const radius = 30 + Math.sin(p.progress * 0.2) * 15;
    p.x = p.centerX + Math.cos(p.angle) * radius;
    p.y = p.centerY + Math.sin(p.angle) * radius * 0.6;
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.85 ? (1 - t) / 0.15 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BeeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.fillStyle = '#ffdd00';
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(-p.size + i * p.size * 0.7, -p.size * 0.5, p.size * 0.3, p.size);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    const wingFlap = Math.sin(p.progress * 1.5) * 0.5;
    ctx.beginPath();
    ctx.ellipse(-p.size * 0.3, -p.size * 0.8 - wingFlap * 3, p.size * 0.5, p.size * 0.3, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(p.size * 0.3, -p.size * 0.8 - wingFlap * 3, p.size * 0.5, p.size * 0.3, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
