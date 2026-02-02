/**
 * Hexagon エフェクト
 * 六角形 + 回転 + ハニカム
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc44', '#44ccff', '#cc44ff'];
interface HexagonParticle extends Particle { type: 'hexagon'; size: number; rotation: number; spin: number; vx: number; vy: number; color: string; }
export const hexagonEffect: Effect = {
  config: { name: 'hexagon', description: '六角形 + ハニカム', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HexagonParticle[] = [];
    const count = Math.floor(7 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(0.8, 1.8);
      particles.push({ id: generateId(), type: 'hexagon', x, y, progress: 0, maxProgress: 55, delay: random(0, 12), alpha: 0, size: random(10, 18), rotation: random(0, Math.PI / 3), spin: random(-0.05, 0.05), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HexagonParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.spin;
    p.alpha = t < 0.12 ? t / 0.12 : (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HexagonParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const px = Math.cos(a) * p.size;
      const py = Math.sin(a) * p.size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
