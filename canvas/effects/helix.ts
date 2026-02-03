/**
 * Helix エフェクト
 * ヘリックス + 二重螺旋 + DNA
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#ff4488', '#ffffff'];
interface HelixParticle extends Particle { type: 'strand'; size: number; strandIndex: number; isSecond: boolean; baseAngle: number; color: string; }
export const helixEffect: Effect = {
  config: { name: 'helix', description: 'ヘリックス + 二重螺旋', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HelixParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'strand', x, y: y - 40 + i * 4, progress: 0, maxProgress: 60, delay: i, alpha: 0, size: random(3, 5), strandIndex: i, isSecond: false, baseAngle: 0, color: DEFAULT_COLORS[0] });
      particles.push({ id: generateId(), type: 'strand', x, y: y - 40 + i * 4, progress: 0, maxProgress: 60, delay: i, alpha: 0, size: random(3, 5), strandIndex: i, isSecond: true, baseAngle: Math.PI, color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HelixParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.baseAngle += 0.05;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HelixParticle;
    const angle = p.baseAngle + p.strandIndex * 0.3;
    const offset = p.isSecond ? Math.PI : 0;
    const px = p.x + Math.cos(angle + offset) * 20;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
