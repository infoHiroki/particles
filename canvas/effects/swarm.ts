/**
 * Swarm エフェクト
 * 群れ + スウォーム + 集団
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#ffaa00', '#ff8800'];
interface SwarmParticle extends Particle { type: 'bug'; size: number; vx: number; vy: number; targetX: number; targetY: number; color: string; }
export const swarmEffect: Effect = {
  config: { name: 'swarm', description: '群れ + スウォーム', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SwarmParticle[] = [];
    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'bug', x: x + random(-50, 50), y: y + random(-50, 50), progress: 0, maxProgress: 60, delay: random(0, 10), alpha: 0, size: random(2, 4), vx: 0, vy: 0, targetX: x, targetY: y, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SwarmParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const dx = p.targetX - p.x + random(-20, 20);
    const dy = p.targetY - p.y + random(-20, 20);
    p.vx += dx * 0.01;
    p.vy += dy * 0.01;
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.x += p.vx;
    p.y += p.vy;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SwarmParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
