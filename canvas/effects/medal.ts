/**
 * Medal エフェクト
 * メダル + 受賞 + 輝き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#cccccc', '#cc8844'];
interface MedalParticle extends Particle { type: 'medal' | 'ribbon' | 'shine'; size: number; rank: number; color: string; }
export const medalEffect: Effect = {
  config: { name: 'medal', description: 'メダル + 受賞', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MedalParticle[] = [];
    const ranks = [0, 1, 2];
    for (let i = 0; i < Math.min(3, Math.floor(3 * intensity)); i++) {
      const offsetX = (i - 1) * 50;
      particles.push({ id: generateId(), type: 'ribbon', x: x + offsetX, y: y - 25, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 20, rank: ranks[i], color: '#4444ff' });
      particles.push({ id: generateId(), type: 'medal', x: x + offsetX, y, progress: 0, maxProgress: 60, delay: i * 5 + 3, alpha: 0, size: 25, rank: ranks[i], color: DEFAULT_COLORS[ranks[i]] });
    }
    const shineCount = Math.floor(8 * intensity);
    for (let i = 0; i < shineCount; i++) {
      particles.push({ id: generateId(), type: 'shine', x: x + random(-60, 60), y: y + random(-30, 30), progress: 0, maxProgress: 40, delay: 15 + i * 3, alpha: 0, size: random(2, 4), rank: 0, color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MedalParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MedalParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'ribbon') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x - 10, p.y);
      ctx.lineTo(p.x + 10, p.y);
      ctx.lineTo(p.x + 5, p.y + 25);
      ctx.lineTo(p.x, p.y + 20);
      ctx.lineTo(p.x - 5, p.y + 25);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'medal') {
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#886600';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold 16px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(['1', '2', '3'][p.rank], p.x, p.y);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
