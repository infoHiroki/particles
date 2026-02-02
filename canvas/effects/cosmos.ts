/**
 * Cosmos エフェクト
 * 宇宙 + 広がり + 神秘
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4466aa', '#aa66aa', '#66aaaa'];
interface CosmosParticle extends Particle { type: 'nebula' | 'star' | 'dust'; size: number; vx: number; vy: number; color: string; }
export const cosmosEffect: Effect = {
  config: { name: 'cosmos', description: '宇宙 + 広がり', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CosmosParticle[] = [];
    const nebulaCount = Math.floor(5 * intensity);
    for (let i = 0; i < nebulaCount; i++) {
      particles.push({ id: generateId(), type: 'nebula', x: x + random(-40, 40), y: y + random(-40, 40), progress: 0, maxProgress: 100, delay: random(0, 20), alpha: 0, size: random(30, 60), vx: random(-0.2, 0.2), vy: random(-0.2, 0.2), color: DEFAULT_COLORS[i % 3] });
    }
    const starCount = Math.floor(20 * intensity);
    for (let i = 0; i < starCount; i++) {
      particles.push({ id: generateId(), type: 'star', x: x + random(-60, 60), y: y + random(-60, 60), progress: 0, maxProgress: 80, delay: random(0, 30), alpha: 0, size: random(1, 3), vx: 0, vy: 0, color: '#ffffff' });
    }
    const dustCount = Math.floor(30 * intensity);
    for (let i = 0; i < dustCount; i++) {
      particles.push({ id: generateId(), type: 'dust', x: x + random(-50, 50), y: y + random(-50, 50), progress: 0, maxProgress: 90, delay: random(0, 25), alpha: 0, size: random(1, 2), vx: random(-0.3, 0.3), vy: random(-0.3, 0.3), color: `hsl(${random(200, 280)}, 50%, 70%)` });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CosmosParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'star') {
      p.alpha = Math.sin(t * Math.PI * 3) * 0.5 + 0.5;
    } else {
      p.alpha = Math.sin(t * Math.PI) * (p.type === 'nebula' ? 0.3 : 0.5);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CosmosParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'nebula') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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
