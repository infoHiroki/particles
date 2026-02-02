/**
 * Cookie エフェクト
 * クッキー + チョコチップ + サクサク
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#cc9966', '#aa7744', '#553322'];
interface CookieParticle extends Particle { type: 'cookie' | 'chip' | 'crumb'; size: number; vx: number; vy: number; rotation: number; color: string; }
export const cookieEffect: Effect = {
  config: { name: 'cookie', description: 'クッキー + チョコチップ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CookieParticle[] = [];
    particles.push({ id: generateId(), type: 'cookie', x, y, progress: 0, maxProgress: 55, alpha: 0, size: 24, vx: 0, vy: 0, rotation: 0, color: DEFAULT_COLORS[0] });
    for (let i = 0; i < 6; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(5, 15);
      particles.push({ id: generateId(), type: 'chip', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 50, delay: 5, alpha: 0, size: random(3, 5), vx: 0, vy: 0, rotation: 0, color: DEFAULT_COLORS[2] });
    }
    const crumbCount = Math.floor(8 * intensity);
    for (let i = 0; i < crumbCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(0.5, 1.5);
      particles.push({ id: generateId(), type: 'crumb', x, y, progress: 0, maxProgress: 40, delay: random(10, 25), alpha: 0, size: random(2, 4), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed + 0.5, rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CookieParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'crumb') {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.rotation += 0.1;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CookieParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'cookie') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#bb8855';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.9, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'chip') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size);
    }
    ctx.restore();
  },
};
