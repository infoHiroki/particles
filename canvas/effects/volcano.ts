/**
 * Volcano エフェクト
 * 火山 + 噴火 + 溶岩
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4400', '#ff6600', '#ffaa00'];
interface VolcanoParticle extends Particle { type: 'lava' | 'rock' | 'smoke' | 'ember'; size: number; vx: number; vy: number; rotation: number; color: string; }
export const volcanoEffect: Effect = {
  config: { name: 'volcano', description: '火山 + 噴火', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: VolcanoParticle[] = [];
    const lavaCount = Math.floor(8 * intensity);
    for (let i = 0; i < lavaCount; i++) {
      const angle = random(-0.8, 0.8) - Math.PI / 2;
      const speed = random(3, 5);
      particles.push({ id: generateId(), type: 'lava', x, y, progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, size: random(6, 12), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, rotation: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const rockCount = Math.floor(5 * intensity);
    for (let i = 0; i < rockCount; i++) {
      const angle = random(-0.6, 0.6) - Math.PI / 2;
      const speed = random(2, 4);
      particles.push({ id: generateId(), type: 'rock', x, y, progress: 0, maxProgress: 55, delay: random(0, 8), alpha: 0, size: random(4, 8), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, rotation: random(0, Math.PI * 2), color: '#553333' });
    }
    const smokeCount = Math.floor(6 * intensity);
    for (let i = 0; i < smokeCount; i++) {
      particles.push({ id: generateId(), type: 'smoke', x: x + random(-15, 15), y, progress: 0, maxProgress: 60, delay: random(5, 25), alpha: 0, size: random(15, 25), vx: random(-0.3, 0.3), vy: random(-1.5, -0.8), rotation: 0, color: '#666666' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as VolcanoParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'lava' || p.type === 'rock') {
      p.vy += 0.15;
      p.rotation += 0.1;
    } else if (p.type === 'smoke') {
      p.size += 0.3;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.7 ? (1 - t) / 0.3 : (p.type === 'smoke' ? 0.5 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as VolcanoParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'lava') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'rock') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(p.size * 0.8, p.size * 0.3);
      ctx.lineTo(-p.size * 0.8, p.size * 0.5);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = p.color + '88';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
