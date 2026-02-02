/**
 * Bird エフェクト
 * 鳥 + 飛翔 + 羽ばたき
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#334455', '#556677', '#778899'];
interface BirdParticle extends Particle { type: 'bird' | 'feather'; size: number; vx: number; vy: number; wingAngle: number; color: string; }
export const birdEffect: Effect = {
  config: { name: 'bird', description: '鳥 + 飛翔', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BirdParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'bird', x: x + random(-20, 20), y: y + random(-10, 10), progress: 0, maxProgress: 70, delay: i * 8, alpha: 0, size: random(15, 22), vx: random(1.5, 2.5), vy: random(-1, -0.3), wingAngle: 0, color: DEFAULT_COLORS[i % 3] });
    }
    for (let i = 0; i < 4; i++) {
      particles.push({ id: generateId(), type: 'feather', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 60, delay: random(15, 35), alpha: 0, size: random(4, 7), vx: random(-0.5, 0.5), vy: random(0.5, 1), wingAngle: random(0, Math.PI), color: '#aabbcc' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BirdParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'bird') {
      p.x += p.vx;
      p.y += p.vy + Math.sin(p.progress * 0.1) * 0.3;
      p.wingAngle = Math.sin(p.progress * 0.3) * 0.7;
    } else {
      p.x += p.vx + Math.sin(p.progress * 0.1) * 0.3;
      p.y += p.vy;
      p.wingAngle += 0.05;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BirdParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    if (p.type === 'bird') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-p.size * 0.3, -p.size * 0.6 * Math.cos(p.wingAngle), -p.size, -p.size * 0.3 * Math.cos(p.wingAngle));
      ctx.quadraticCurveTo(-p.size * 0.3, 0, 0, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(p.size * 0.3, -p.size * 0.6 * Math.cos(p.wingAngle), p.size, -p.size * 0.3 * Math.cos(p.wingAngle));
      ctx.quadraticCurveTo(p.size * 0.3, 0, 0, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p.size * 0.5, 0);
      ctx.lineTo(p.size * 0.7, -p.size * 0.1);
      ctx.lineTo(p.size * 0.7, p.size * 0.1);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.rotate(p.wingAngle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
