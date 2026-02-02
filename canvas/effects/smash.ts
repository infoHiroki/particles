/**
 * Smash エフェクト
 * スマッシュ + 粉砕 + 破壊
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#888888', '#666666', '#444444'];
interface SmashParticle extends Particle { type: 'debris' | 'dust'; size: number; vx: number; vy: number; rotation: number; rotSpeed: number; color: string; }
export const smashEffect: Effect = {
  config: { name: 'smash', description: 'スマッシュ + 粉砕', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SmashParticle[] = [];
    const debrisCount = Math.floor(15 * intensity);
    for (let i = 0; i < debrisCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(2, 6);
      particles.push({ id: generateId(), type: 'debris', x, y, progress: 0, maxProgress: 45, delay: random(0, 5), alpha: 0, size: random(4, 10), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2, rotation: random(0, Math.PI * 2), rotSpeed: random(-0.3, 0.3), color: DEFAULT_COLORS[i % 3] });
    }
    const dustCount = Math.floor(10 * intensity);
    for (let i = 0; i < dustCount; i++) {
      particles.push({ id: generateId(), type: 'dust', x: x + random(-20, 20), y, progress: 0, maxProgress: 50, delay: 5, alpha: 0, size: random(8, 15), vx: random(-0.5, 0.5), vy: random(-1, -0.3), rotation: 0, rotSpeed: 0, color: '#999999' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SmashParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'debris') {
      p.vy += 0.2;
      p.rotation += p.rotSpeed;
    } else {
      p.size += 0.3;
    }
    p.alpha = 1 - t;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SmashParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'debris') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    } else {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
