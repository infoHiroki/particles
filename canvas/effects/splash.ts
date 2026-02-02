/**
 * Splash エフェクト
 * 水しぶき + 飛散 + 衝撃
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#66aaff', '#ffffff'];
interface SplashParticle extends Particle { type: 'drop' | 'ring'; size: number; vx: number; vy: number; gravity: number; color: string; }
export const splashEffect: Effect = {
  config: { name: 'splash', description: '水しぶき + 飛散', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SplashParticle[] = [];
    const dropCount = Math.floor(15 * intensity);
    for (let i = 0; i < dropCount; i++) {
      const angle = random(-Math.PI, 0);
      const speed = random(2, 5);
      particles.push({ id: generateId(), type: 'drop', x, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: random(2, 5), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, gravity: 0.12, color: DEFAULT_COLORS[i % 3] });
    }
    particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 30, delay: 0, alpha: 0, size: 5, vx: 0, vy: 0, gravity: 0, color: DEFAULT_COLORS[0] });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SplashParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'drop') {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = 1 - t;
    } else {
      p.size = 5 + t * 30;
      p.alpha = (1 - t) * 0.6;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SplashParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
