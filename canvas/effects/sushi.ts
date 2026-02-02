/**
 * Sushi エフェクト
 * 寿司 + 日本 + 新鮮
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6644', '#ffffff', '#222222'];
interface SushiParticle extends Particle { type: 'rice' | 'fish' | 'nori' | 'shine'; size: number; rotation: number; color: string; }
export const sushiEffect: Effect = {
  config: { name: 'sushi', description: '寿司 + 新鮮', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SushiParticle[] = [];
    particles.push({ id: generateId(), type: 'rice', x, y: y + 5, progress: 0, maxProgress: 55, alpha: 0, size: 20, rotation: 0, color: DEFAULT_COLORS[1] });
    particles.push({ id: generateId(), type: 'fish', x, y: y - 5, progress: 0, maxProgress: 55, delay: 3, alpha: 0, size: 22, rotation: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'nori', x, y, progress: 0, maxProgress: 50, delay: 5, alpha: 0, size: 24, rotation: 0, color: DEFAULT_COLORS[2] });
    const shineCount = Math.floor(4 * intensity);
    for (let i = 0; i < shineCount; i++) {
      particles.push({ id: generateId(), type: 'shine', x: x + random(-15, 15), y: y + random(-15, 5), progress: 0, maxProgress: 40, delay: random(8, 25), alpha: 0, size: random(2, 4), rotation: 0, color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SushiParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SushiParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'rice') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'fish') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff8866';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(p.x - p.size * 0.5 + i * p.size * 0.4, p.y - p.size * 0.25);
        ctx.lineTo(p.x - p.size * 0.3 + i * p.size * 0.4, p.y + p.size * 0.25);
        ctx.stroke();
      }
    } else if (p.type === 'nori') {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 3, p.y - p.size * 0.3, 6, p.size * 0.6);
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
