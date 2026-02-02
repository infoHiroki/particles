/**
 * Exclaim エフェクト
 * 感嘆 + ビックリ + !
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0000', '#ff3333', '#ffff00'];
interface ExclaimParticle extends Particle { type: 'mark' | 'burst'; size: number; angle: number; color: string; }
export const exclaimEffect: Effect = {
  config: { name: 'exclaim', description: '感嘆 + ビックリ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ExclaimParticle[] = [];
    particles.push({ id: generateId(), type: 'mark', x, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: 30, angle: 0, color: DEFAULT_COLORS[0] });
    const burstCount = Math.floor(8 * intensity);
    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'burst', x, y, progress: 0, maxProgress: 40, delay: 5, alpha: 0, size: random(15, 25), angle, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ExclaimParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ExclaimParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'mark') {
      ctx.fillStyle = p.color;
      ctx.font = `bold ${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', p.x, p.y);
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const startDist = 20;
      const endDist = startDist + p.size;
      ctx.moveTo(p.x + Math.cos(p.angle) * startDist, p.y + Math.sin(p.angle) * startDist);
      ctx.lineTo(p.x + Math.cos(p.angle) * endDist, p.y + Math.sin(p.angle) * endDist);
      ctx.stroke();
    }
    ctx.restore();
  },
};
