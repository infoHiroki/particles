/**
 * Orange エフェクト
 * オレンジ + 果汁 + 新鮮
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff8800', '#ffaa00', '#ffcc00'];
interface OrangeParticle extends Particle { type: 'orange' | 'juice' | 'segment'; size: number; vx: number; vy: number; rotation: number; color: string; }
export const orangeEffect: Effect = {
  config: { name: 'orange', description: 'オレンジ + 果汁', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: OrangeParticle[] = [];
    particles.push({ id: generateId(), type: 'orange', x, y, progress: 0, maxProgress: 55, alpha: 0, size: 20, vx: 0, vy: 0, rotation: 0, color: DEFAULT_COLORS[0] });
    const juiceCount = Math.floor(8 * intensity);
    for (let i = 0; i < juiceCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 2.5);
      particles.push({ id: generateId(), type: 'juice', x, y, progress: 0, maxProgress: 40, delay: random(5, 15), alpha: 0, size: random(3, 6), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, rotation: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as OrangeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'juice') {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.7 ? (1 - t) / 0.3 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as OrangeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'orange') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffeecc';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffcc88';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + Math.cos(a) * p.size * 0.8, p.y + Math.sin(a) * p.size * 0.8);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
