/**
 * Supernova エフェクト
 * 超新星爆発 + 閃光 + 衝撃波
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ffff66', '#ff6666'];
interface SupernovaParticle extends Particle { type: 'flash' | 'wave' | 'debris'; size: number; maxSize: number; angle: number; speed: number; color: string; }
export const supernovaEffect: Effect = {
  config: { name: 'supernova', description: '超新星爆発 + 閃光', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SupernovaParticle[] = [];
    particles.push({ id: generateId(), type: 'flash', x, y, progress: 0, maxProgress: 20, delay: 0, alpha: 0, size: 5, maxSize: 100, angle: 0, speed: 0, color: '#ffffff' });
    const waveCount = Math.floor(3 * intensity);
    for (let i = 0; i < waveCount; i++) {
      particles.push({ id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 60, delay: 10 + i * 8, alpha: 0, size: 10, maxSize: 80 + i * 20, angle: 0, speed: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const debrisCount = Math.floor(30 * intensity);
    for (let i = 0; i < debrisCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({ id: generateId(), type: 'debris', x, y, progress: 0, maxProgress: 70, delay: 15 + random(0, 10), alpha: 0, size: random(2, 6), maxSize: 0, angle, speed: random(2, 5), color: `hsl(${random(30, 60)}, 100%, ${random(60, 90)}%)` });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SupernovaParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'flash') {
      p.size = p.maxSize * t;
      p.alpha = 1 - t;
    } else if (p.type === 'wave') {
      p.size = p.maxSize * t;
      p.alpha = (1 - t) * 0.6;
    } else {
      p.x += Math.cos(p.angle) * p.speed * (1 - t);
      p.y += Math.sin(p.angle) * p.speed * (1 - t);
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SupernovaParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'flash') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#ffffaa');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'wave') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
