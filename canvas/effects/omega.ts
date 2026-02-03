/**
 * Omega エフェクト
 * オメガ + 終焉 + 完結
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4444ff', '#2222aa', '#000066'];
interface OmegaParticle extends Particle { type: 'final'; size: number; targetX: number; targetY: number; startX: number; startY: number; hue: number; color: string; }
export const omegaEffect: Effect = {
  config: { name: 'omega', description: 'オメガ + 終焉', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: OmegaParticle[] = [];
    const count = Math.floor(50 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(80, 120);
      particles.push({ id: generateId(), type: 'final', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 60, delay: random(0, 20), alpha: 0, size: random(2, 5), targetX: x, targetY: y, startX: x + Math.cos(angle) * dist, startY: y + Math.sin(angle) * dist, hue: 240 + random(-20, 20), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as OmegaParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    p.x = p.startX + (p.targetX - p.startX) * ease;
    p.y = p.startY + (p.targetY - p.startY) * ease;
    p.size = 5 * (1 - t);
    p.hue -= 0.5;
    p.alpha = t < 0.8 ? Math.sin(t * Math.PI * 0.625) : (1 - t) * 5;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as OmegaParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = `hsl(${p.hue}, 70%, 50%)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
