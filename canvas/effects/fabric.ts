/**
 * Fabric エフェクト
 * ファブリック + 布 + ひらひら
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d'];
interface FabricParticle extends Particle { type: 'cloth'; width: number; height: number; wave: number; vx: number; vy: number; color: string; }
export const fabricEffect: Effect = {
  config: { name: 'fabric', description: 'ファブリック + 布', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FabricParticle[] = [];
    const count = Math.floor(12 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({ id: generateId(), type: 'cloth', x, y, progress: 0, maxProgress: 60, delay: random(0, 10), alpha: 0, width: random(10, 20), height: random(8, 15), wave: random(0, Math.PI * 2), vx: Math.cos(angle) * random(1, 2), vy: random(0.5, 1.5), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FabricParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx + Math.sin(p.wave) * 0.5;
    p.y += p.vy;
    p.wave += 0.15;
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FabricParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    const waveOffset = Math.sin(p.wave) * 3;
    ctx.moveTo(p.x - p.width / 2, p.y);
    ctx.quadraticCurveTo(p.x, p.y + waveOffset, p.x + p.width / 2, p.y);
    ctx.lineTo(p.x + p.width / 2, p.y + p.height);
    ctx.quadraticCurveTo(p.x, p.y + p.height - waveOffset, p.x - p.width / 2, p.y + p.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
