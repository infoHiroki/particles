/**
 * Skull エフェクト
 * 骸骨 + 危険 + 死
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ddddcc', '#ccccbb', '#bbbbaa'];
interface SkullParticle extends Particle { type: 'skull' | 'smoke'; size: number; currentX: number; currentY: number; vy: number; color: string; }
export const skullEffect: Effect = {
  config: { name: 'skull', description: '骸骨 + 危険', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SkullParticle[] = [];
    particles.push({ id: generateId(), type: 'skull', x, y, progress: 0, maxProgress: 55, alpha: 0, size: 30, currentX: x, currentY: y, vy: -0.5, color: DEFAULT_COLORS[0] });
    const smokeCount = Math.floor(10 * intensity);
    for (let i = 0; i < smokeCount; i++) particles.push({ id: generateId(), type: 'smoke', x, y, progress: 0, maxProgress: 50, delay: random(10, 40), alpha: 0, size: random(15, 30), currentX: x + random(-25, 25), currentY: y + random(-10, 20), vy: -random(0.5, 1.5), color: '#333333' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SkullParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'skull') { p.currentY += p.vy; p.alpha = t < 0.2 ? t / 0.2 : t > 0.75 ? (1 - t) / 0.25 : 1; }
    else { p.currentY += p.vy; p.size += 0.3; p.alpha = (t < 0.2 ? t / 0.2 : (1 - t) / 0.8) * 0.4; }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SkullParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'skull') {
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.currentX, p.currentY - p.size * 0.2, p.size * 0.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(p.currentX, p.currentY + p.size * 0.3, p.size * 0.5, 0, Math.PI); ctx.fill();
      ctx.fillStyle = '#333333';
      ctx.beginPath(); ctx.ellipse(p.currentX - p.size * 0.25, p.currentY - p.size * 0.2, p.size * 0.2, p.size * 0.25, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(p.currentX + p.size * 0.25, p.currentY - p.size * 0.2, p.size * 0.2, p.size * 0.25, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(p.currentX, p.currentY + p.size * 0.1); ctx.lineTo(p.currentX - p.size * 0.1, p.currentY + p.size * 0.25); ctx.lineTo(p.currentX + p.size * 0.1, p.currentY + p.size * 0.25); ctx.closePath(); ctx.fill();
    } else {
      const g = ctx.createRadialGradient(p.currentX, p.currentY, 0, p.currentX, p.currentY, p.size);
      g.addColorStop(0, p.color + '60'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
};
