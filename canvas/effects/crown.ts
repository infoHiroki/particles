/**
 * Crown エフェクト
 * 王冠 + 輝き + 威厳
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffdd44', '#ffcc00', '#ffaa00'];

interface CrownParticle extends Particle {
  type: 'crown' | 'sparkle' | 'glow';
  size: number;
  currentY: number;
  color: string;
}

export const crownEffect: Effect = {
  config: { name: 'crown', description: '王冠 + 輝き', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CrownParticle[] = [];
    particles.push({ id: generateId(), type: 'crown', x, y: y - 30, progress: 0, maxProgress: 60, alpha: 0, size: 35, currentY: y - 50, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'glow', x, y: y - 30, progress: 0, maxProgress: 55, delay: 5, alpha: 0, size: 50, currentY: y - 30, color: DEFAULT_COLORS[1] });
    const sparkleCount = Math.floor(12 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-40, 40), y: y - 30 + random(-30, 10), progress: 0, maxProgress: 40, delay: random(10, 40), alpha: 0, size: random(2, 4), currentY: 0, color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CrownParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'crown') { p.currentY += (p.y - p.currentY) * 0.1; p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1; }
    else if (p.type === 'glow') { p.alpha = (t < 0.3 ? t / 0.3 : (1 - t) / 0.7) * 0.5; }
    else { p.alpha = Math.abs(Math.sin(p.progress * 0.4)) * (1 - t); }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CrownParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'crown') {
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size, p.currentY + p.size * 0.4);
      ctx.lineTo(p.x - p.size * 0.6, p.currentY - p.size * 0.2);
      ctx.lineTo(p.x - p.size * 0.3, p.currentY + p.size * 0.1);
      ctx.lineTo(p.x, p.currentY - p.size * 0.5);
      ctx.lineTo(p.x + p.size * 0.3, p.currentY + p.size * 0.1);
      ctx.lineTo(p.x + p.size * 0.6, p.currentY - p.size * 0.2);
      ctx.lineTo(p.x + p.size, p.currentY + p.size * 0.4);
      ctx.closePath(); ctx.fill();
    } else if (p.type === 'glow') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '88'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
};
