/**
 * Virus エフェクト
 * ウイルス + 感染 + バグ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0044', '#cc0033', '#990022'];
interface VirusParticle extends Particle { type: 'cell' | 'spike'; size: number; angle: number; dist: number; rotSpeed: number; color: string; }
export const virusEffect: Effect = {
  config: { name: 'virus', description: 'ウイルス + 感染', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: VirusParticle[] = [];
    particles.push({ id: generateId(), type: 'cell', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 20, angle: 0, dist: 0, rotSpeed: 0.02, color: DEFAULT_COLORS[0] });
    const spikeCount = Math.floor(12 * intensity);
    for (let i = 0; i < spikeCount; i++) {
      const angle = (i / spikeCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'spike', x, y, progress: 0, maxProgress: 60, delay: 5, alpha: 0, size: random(4, 8), angle, dist: 22, rotSpeed: 0.02, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as VirusParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.rotSpeed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as VirusParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'cell') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const px = p.x + Math.cos(p.angle) * p.dist;
      const py = p.y + Math.sin(p.angle) * p.dist;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
