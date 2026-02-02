/**
 * Pizza エフェクト
 * ピザ + チーズ + 美味しい
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#ff6600', '#44aa44'];
interface PizzaParticle extends Particle { type: 'slice' | 'cheese' | 'topping'; size: number; vx: number; vy: number; rotation: number; color: string; }
export const pizzaEffect: Effect = {
  config: { name: 'pizza', description: 'ピザ + チーズ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PizzaParticle[] = [];
    particles.push({ id: generateId(), type: 'slice', x, y, progress: 0, maxProgress: 55, alpha: 0, size: 30, vx: 0, vy: 0, rotation: 0, color: '#ffcc66' });
    const cheeseCount = Math.floor(5 * intensity);
    for (let i = 0; i < cheeseCount; i++) {
      particles.push({ id: generateId(), type: 'cheese', x: x + random(-15, 15), y: y + random(-10, 15), progress: 0, maxProgress: 50, delay: random(8, 20), alpha: 0, size: random(4, 8), vx: random(-0.3, 0.3), vy: random(0.3, 0.8), rotation: random(0, Math.PI), color: DEFAULT_COLORS[0] });
    }
    const toppings = ['#ff4400', '#44aa44', '#884422'];
    for (let i = 0; i < 4; i++) {
      particles.push({ id: generateId(), type: 'topping', x: x + random(-12, 12), y: y + random(-8, 12), progress: 0, maxProgress: 45, delay: random(5, 15), alpha: 0, size: random(3, 5), vx: random(-0.2, 0.2), vy: random(0.2, 0.5), rotation: 0, color: toppings[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PizzaParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'cheese' || p.type === 'topping') {
      p.x += p.vx;
      p.y += p.vy;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PizzaParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'slice') {
      ctx.translate(p.x, p.y);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.8);
      ctx.lineTo(p.size * 0.6, p.size * 0.5);
      ctx.lineTo(-p.size * 0.6, p.size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffaa44';
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.7);
      ctx.lineTo(p.size * 0.5, p.size * 0.4);
      ctx.lineTo(-p.size * 0.5, p.size * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#cc9944';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.size * 0.6, p.size * 0.5);
      ctx.lineTo(-p.size * 0.6, p.size * 0.5);
      ctx.stroke();
    } else if (p.type === 'cheese') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.quadraticCurveTo(p.x + p.size, p.y, p.x, p.y + p.size);
      ctx.quadraticCurveTo(p.x - p.size * 0.5, p.y, p.x, p.y - p.size);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
