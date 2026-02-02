/**
 * Curtain エフェクト
 * カーテン + 開閉 + 幕
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#cc0000', '#aa0000', '#ffcc00'];
interface CurtainParticle extends Particle { type: 'left' | 'right' | 'sparkle'; size: number; openAmount: number; color: string; }
export const curtainEffect: Effect = {
  config: { name: 'curtain', description: 'カーテン + 開閉', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CurtainParticle[] = [];
    particles.push({ id: generateId(), type: 'left', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 50, openAmount: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'right', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 50, openAmount: 0, color: DEFAULT_COLORS[1] });
    const sparkleCount = Math.floor(8 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-5, 5), y: y + random(-30, 30), progress: 0, maxProgress: 40, delay: 30 + i * 3, alpha: 0, size: random(3, 5), openAmount: 0, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CurtainParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type !== 'sparkle') {
      p.openAmount = t * 40;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CurtainParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'left') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x - p.openAmount, p.y - p.size);
      ctx.quadraticCurveTo(p.x - p.openAmount - 20, p.y, p.x - p.openAmount, p.y + p.size);
      ctx.lineTo(p.x - p.openAmount - 30, p.y + p.size);
      ctx.lineTo(p.x - p.openAmount - 30, p.y - p.size);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'right') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x + p.openAmount, p.y - p.size);
      ctx.quadraticCurveTo(p.x + p.openAmount + 20, p.y, p.x + p.openAmount, p.y + p.size);
      ctx.lineTo(p.x + p.openAmount + 30, p.y + p.size);
      ctx.lineTo(p.x + p.openAmount + 30, p.y - p.size);
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
