/**
 * Quantum エフェクト
 * クォンタム + 量子 + 確率
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ffaa', '#00aaff', '#aa00ff'];
interface QuantumParticle extends Particle { type: 'qubit'; size: number; positions: {x: number; y: number}[]; currentPos: number; color: string; }
export const quantumEffect: Effect = {
  config: { name: 'quantum', description: 'クォンタム + 量子', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: QuantumParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      const positions: {x: number; y: number}[] = [];
      for (let j = 0; j < 5; j++) {
        positions.push({x: x + random(-50, 50), y: y + random(-50, 50)});
      }
      particles.push({ id: generateId(), type: 'qubit', x, y, progress: 0, maxProgress: 55, delay: random(0, 10), alpha: 0, size: random(3, 6), positions, currentPos: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as QuantumParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (random(0, 1) > 0.85) {
      p.currentPos = Math.floor(random(0, p.positions.length));
    }
    const pos = p.positions[p.currentPos];
    p.x = pos.x;
    p.y = pos.y;
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as QuantumParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha * 0.2;
    ctx.fillStyle = p.color;
    for (const pos of p.positions) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
