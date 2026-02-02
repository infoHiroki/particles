/**
 * Badge エフェクト
 * バッジ + 称号 + 認定
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4488ff', '#44ff88', '#ff8844'];
interface BadgeParticle extends Particle { type: 'badge' | 'ribbon' | 'shine'; size: number; text: string; color: string; }
export const badgeEffect: Effect = {
  config: { name: 'badge', description: 'バッジ + 称号', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BadgeParticle[] = [];
    particles.push({ id: generateId(), type: 'badge', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 30, text: '★', color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'ribbon', x: x - 20, y: y + 25, progress: 0, maxProgress: 60, delay: 5, alpha: 0, size: 15, text: '', color: DEFAULT_COLORS[1] });
    particles.push({ id: generateId(), type: 'ribbon', x: x + 20, y: y + 25, progress: 0, maxProgress: 60, delay: 5, alpha: 0, size: 15, text: '', color: DEFAULT_COLORS[1] });
    const shineCount = Math.floor(8 * intensity);
    for (let i = 0; i < shineCount; i++) {
      particles.push({ id: generateId(), type: 'shine', x: x + random(-35, 35), y: y + random(-35, 35), progress: 0, maxProgress: 40, delay: 15 + i * 3, alpha: 0, size: random(2, 4), text: '', color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BadgeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BadgeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'badge') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = i % 2 === 0 ? p.size : p.size * 0.7;
        if (i === 0) ctx.moveTo(p.x + Math.cos(angle) * r, p.y + Math.sin(angle) * r);
        else ctx.lineTo(p.x + Math.cos(angle) * r, p.y + Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold 20px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.text, p.x, p.y);
    } else if (p.type === 'ribbon') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 5);
      ctx.lineTo(p.x + 8, p.y + p.size);
      ctx.lineTo(p.x, p.y + p.size - 5);
      ctx.lineTo(p.x - 8, p.y + p.size);
      ctx.closePath();
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
