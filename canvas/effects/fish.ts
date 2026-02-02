/**
 * Fish エフェクト
 * 魚 + 泳ぎ + 水中
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aaff', '#ff8844', '#44ff88'];
interface FishParticle extends Particle { type: 'fish' | 'bubble'; size: number; vx: number; vy: number; tailAngle: number; color: string; }
export const fishEffect: Effect = {
  config: { name: 'fish', description: '魚 + 泳ぎ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FishParticle[] = [];
    const count = Math.floor(4 * intensity);
    for (let i = 0; i < count; i++) {
      const dir = random(0, 1) > 0.5 ? 1 : -1;
      particles.push({ id: generateId(), type: 'fish', x: x + random(-40, 40), y: y + random(-30, 30), progress: 0, maxProgress: 75, delay: i * 6, alpha: 0, size: random(10, 16), vx: dir * random(1, 2), vy: random(-0.3, 0.3), tailAngle: 0, color: DEFAULT_COLORS[i % 3] });
    }
    for (let i = 0; i < 6; i++) {
      particles.push({ id: generateId(), type: 'bubble', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 50, delay: random(5, 30), alpha: 0, size: random(2, 5), vx: 0, vy: -random(0.5, 1), tailAngle: 0, color: '#88ddff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FishParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'fish') {
      p.x += p.vx;
      p.y += p.vy + Math.sin(p.progress * 0.15) * 0.3;
      p.tailAngle = Math.sin(p.progress * 0.4) * 0.4;
    } else {
      p.y += p.vy;
      p.x += Math.sin(p.progress * 0.2) * 0.3;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FishParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'fish') {
      ctx.translate(p.x, p.y);
      if (p.vx < 0) ctx.scale(-1, 1);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-p.size, 0);
      ctx.lineTo(-p.size - p.size * 0.6 + Math.sin(p.tailAngle) * 3, -p.size * 0.4);
      ctx.lineTo(-p.size - p.size * 0.6 + Math.sin(p.tailAngle) * 3, p.size * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(p.size * 0.5, -p.size * 0.1, p.size * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(p.size * 0.55, -p.size * 0.1, p.size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
