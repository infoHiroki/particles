/**
 * Flip2 エフェクト
 * フリップ + 反転 + 回転
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff8844', '#ffaa66', '#ffffff'];
interface Flip2Particle extends Particle { type: 'card' | 'sparkle'; size: number; flipAngle: number; color: string; }
export const flip2Effect: Effect = {
  config: { name: 'flip2', description: 'フリップ + 反転', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Flip2Particle[] = [];
    particles.push({ id: generateId(), type: 'card', x, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: 40, flipAngle: 0, color: DEFAULT_COLORS[0] });
    const sparkleCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-30, 30), y: y + random(-30, 30), progress: 0, maxProgress: 40, delay: 15 + i * 2, alpha: 0, size: random(2, 5), flipAngle: 0, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Flip2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'card') {
      p.flipAngle = t * Math.PI;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Flip2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'card') {
      ctx.translate(p.x, p.y);
      ctx.scale(Math.cos(p.flipAngle), 1);
      ctx.fillStyle = p.flipAngle < Math.PI / 2 ? p.color : DEFAULT_COLORS[1];
      ctx.fillRect(-p.size / 2, -p.size * 0.7, p.size, p.size * 1.4);
      ctx.strokeStyle = '#884422';
      ctx.lineWidth = 2;
      ctx.strokeRect(-p.size / 2, -p.size * 0.7, p.size, p.size * 1.4);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
