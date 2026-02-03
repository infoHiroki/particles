/**
 * Crystal2 エフェクト
 * クリスタル2 + 結晶成長 + プリズム
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#e0ffff', '#b0e0e6', '#87ceeb'];
interface Crystal2Particle extends Particle { type: 'prism'; size: number; facets: number; rotation: number; shine: number; growthRate: number; color: string; }
export const crystal2Effect: Effect = {
  config: { name: 'crystal2', description: 'クリスタル2 + 結晶成長', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Crystal2Particle[] = [];
    const count = Math.floor(10 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(10, 40);
      particles.push({ id: generateId(), type: 'prism', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 55, delay: random(0, 12), alpha: 0, size: 2, facets: Math.floor(random(5, 8)), rotation: random(0, Math.PI * 2), shine: 0, growthRate: random(0.3, 0.6), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Crystal2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.size = 2 + t * 15;
    p.shine = Math.sin(t * Math.PI * 4) * 0.5 + 0.5;
    p.rotation += 0.015;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Crystal2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    for (let i = 0; i < p.facets; i++) {
      const a = (i / p.facets) * Math.PI * 2;
      const r = p.size * (i % 2 === 0 ? 1 : 0.5);
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${p.shine * 0.5})`;
    ctx.beginPath();
    ctx.arc(-p.size * 0.25, -p.size * 0.25, p.size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
