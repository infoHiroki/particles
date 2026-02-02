/**
 * Shock2 エフェクト
 * ショック + 驚き + ガーン
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#4444ff', '#6666ff', '#2222cc'];
interface Shock2Particle extends Particle { type: 'line' | 'bg'; size: number; angle: number; color: string; }
export const shock2Effect: Effect = {
  config: { name: 'shock2', description: 'ショック + 驚き', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Shock2Particle[] = [];
    particles.push({ id: generateId(), type: 'bg', x, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: 40, angle: 0, color: '#000033' });
    const lineCount = Math.floor(8 * intensity);
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'line', x, y, progress: 0, maxProgress: 50, delay: 5, alpha: 0, size: random(20, 35), angle, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Shock2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI) * (p.type === 'bg' ? 0.3 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Shock2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'bg') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.x + Math.cos(p.angle) * 10, p.y + Math.sin(p.angle) * 10);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.size, p.y + Math.sin(p.angle) * p.size);
      ctx.stroke();
    }
    ctx.restore();
  },
};
